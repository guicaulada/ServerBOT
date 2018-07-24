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

__ServerBOT.startService = (service) => {
  let cmd = 'bash';
  let cmdArgs = [service.start];
  if (__ServerBOT.isWin) {
    cmd = 'powershell';
  }
  let path = service.start.split('\\');
  path = path.slice(0, path.length - 1).join('\\');
  let start = __spawn(cmd, cmdArgs, {cwd: path});
  service.status = true;
  service.pid = start.pid;
};

__ServerBOT.stopService = (service) => {
  let cmd = 'kill';
  let cmdArgs = ['-15', service.pid];
  if (__ServerBOT.isWin) {
    cmd = 'powershell';
    cmdArgs = ['-Command', `Stop-Process -Id ${service.pid} -Force`];
  }
  let stop = __spawn(cmd, cmdArgs);
  stop.on('exit', (data) => {
    service.status = false;
  });
};

__ServerBOT.servicePoller = () => {
  let services = __ServerBOT.serviceByPort();
  let poller = () => {
    let success = {};

    let nextPoller = () => {
      for (port in services) {
        if (!success[port]) {
          services[port].status = false;
          if (!services[port].pid) services[port].pid = '-';
          if (!services[port].command) services[port].command = '-';
          if (!services[port].arguments) services[port].arguments = '-';

          if (services[port].keepAlive) {
            __ServerBOT.startService(services[port]);
            if (!(services[port].notify === false)) {
              __ServerBOT.createMessage(__ServerBOT.config.channel, `The service **${services[port].id}** has been restarted automatically`);
            }
          }
        }
      }
      __ServerBOT.servicePoller = setTimeout(poller, __ServerBOT.config.updateInterval);
    };

    let nextLine = (lines, i, max) => {
      if (i == max) return nextPoller();
      let line = lines[i];
      let lnArr = line.split(/ +/g);
      let out = lnArr.slice(Number(__ServerBOT.isWin), lnArr.length);
      if (out[0] && (out[0] == 'udp' || out[0] == 'tcp')) {
        let pid = out[out.length - 1];
        let addr = out[3].split(':');
        if (__ServerBOT.isWin) {
          addr = out[1].split(':');
        }
        let port = addr[addr.length - 1];
        if (services[port] && !success[port]) {
          success[port] = true;
          let cmd = 'ps';
          let args = ['-p', pid, '-o', 'command='];
          if (__ServerBOT.isWin) {
            cmd = 'powershell';
            args = ['-Command', `Get-CimInstance Win32_Process -Filter "processid = ${pid}" | Select-Object CommandLine | format-list`];
          }
          let psOut = '';
          let ps = __spawn(cmd, args);
          ps.stdout.on('data', (data) => {
            psOut = psOut + data.toString('utf8').toLowerCase();
          });
          ps.on('close', (data) => {
            if (__ServerBOT.isWin) {
              psOut = psOut.split('\r\n').filter((e) => {
                return e.length != 0;
              });
              psOut = psOut.map((e) => {
                return e.trim();
              }).join(' ').replace('commandline : ', '');
            }
            let args = psOut.search('.exe');
            if (args > 0) args += 5;
            if (args < 0) args = psOut.search(' "-');
            if (args < 0) args = psOut.search(' -');
            if (args < 0) args = psOut.search('" ')+1;
            let psArgs = psOut.slice(args, psOut.length);
            let psCmd = psOut.slice(0, args);
            services[port].pid = pid || '-';
            services[port].command = psCmd || '-';
            services[port].arguments = psArgs || '-';
            let id = services[port].id.toLowerCase();
            let match = services[port].match;
            if (match) match = match.toLowerCase();
            if (psOut.includes(id) || psOut.includes(match)) {
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
