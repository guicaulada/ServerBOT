__ServerBOT.serviceByPort = () => {
  let result = {};
  for (service of __ServerBOT.config.services) {
    result[service.port] = service;
  }
  return result;
};

__ServerBOT.servicePoller = () => {
  let isWin = process.platform === 'win32';
  let services = __ServerBOT.serviceByPort();
  let poller = () => {
    let ready = false;
    let success = {};

    let next = () => {
      if (!ready) {
        ready = true;
      } else {
        ready = false;
        for (port in services) {
          if (!success[port]) {
            services[port].status = false;
          }
        }
        __ServerBOT.servicePoller = setTimeout(poller, __ServerBOT.config.updateInterval);
      }
    };

    let ns = __spawn('netstat', ['-noa']);
    ns.stdout.on('data', (data) => {
      let lines = data.toString('utf8').toLowerCase().split('\r\n');
      lines.forEach((line) => {
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
              if (isWin) psOut = psOut.replace(/ +/g, '').split('\r\n')[3];
              services[port].command = psOut;
              if (psOut.search(services[port].id.toLowerCase())) {
                services[port].status = true;
                console.log(psOut);
              }
              next();
            });
          }
        }
      });
    });
    ns.on('close', (data) => {
      next();
    });
  };
  poller();
};

__ServerBOT.servicePoller();
