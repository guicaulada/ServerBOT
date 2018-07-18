__ServerBOT.serviceByPort = () => {
  let result = {};
  for (service of __ServerBOT.config.services) {
    result[service.port] = service;
  }
  return result;
};

__ServerBOT.serviceById = () => {
  let result = {};
  for (service of __ServerBOT.config.services) {
    result[service.id] = service;
  }
  return result;
};

__ServerBOT.servicePoller = () => {
  let isWin = process.platform === 'win32';
  let services = __ServerBOT.serviceByPort();
  let poller = () => {
    let success = {};

    let nextPoller = () => {
      for (port in services) {
        if (!success[port]) {
          services[port].status = false;
        }
      }
      __ServerBOT.servicePoller = setTimeout(poller, __ServerBOT.config.updateInterval);
    };

    let nextLine = (lines, i, max) => {
      if (i == max) return nextPoller();
      let line = lines[i];
      let lnArr = line.split(/ +/g);
      let out = lnArr.slice(Number(isWin), lnArr.length);
      if (out[0] && (out[0] == 'udp' || out[0] == 'tcp')) {
        let pid = out[out.length - 1];
        let addr = out[3].split(':');
        if (isWin) {
          addr = out[1].split(':');
        }
        let port = addr[addr.length - 1];
        if (services[port] && !success[port]) {
          success[port] = true;
          let cmd = 'ps';
          let args = ['-p', pid, '-o', 'command='];
          if (isWin) {
            cmd = 'powershell';
            args = ['-Command', `Get-Process -Id ${pid} -FileVersionInfo`];
          }
          let psOut = '';
          let ps = __spawn(cmd, args);
          ps.stdout.on('data', (data) => {
            psOut = psOut + data.toString('utf8').toLowerCase();
          });
          ps.on('close', (data) => {
            if (isWin) {
              psOut = psOut.split('\r\n').filter((e) => {
                return e.length != 0;
              });
              psOut = psOut[psOut.length - 1];

              psOut = psOut.split(/ +/g).filter((e) => {
                return e.length != 0;
              });
              psOut = psOut.slice(2, psOut.length).join(' ');
            }
            services[port].command = psOut;
            if (psOut.search(services[port].id.toLowerCase())) {
              services[port].status = true;
            }
            nextLine(lines, i + 1, max);
          });
        } else {
          nextLine(lines, i + 1, max);
        }
      } else {
        nextLine(lines, i + 1, max);
      }
    };

    let nsOut = '';
    let ns = __spawn('netstat', ['-noa']);
    ns.stdout.on('data', (data) => {
      nsOut = nsOut + data.toString('utf8').toLowerCase();
    });
    ns.on('close', (data) => {
      let lines = nsOut.split('\r\n');
      nextLine(lines, 0, lines.length);
    });
  };
  poller();
};

__ServerBOT.servicePoller();
