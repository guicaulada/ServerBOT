__ServerBOT.updateServices = () => {
  __ServerBOT.config.services.forEach((service) => {
    let success = false;
    service.ports.forEach((port) => {
      let address = service.address + ':' + port;
      let ping = __spawn('psping', ['-n', 3, '-w', 0, '-i', 0, address]);
      let output = '';
      ping.stdout.on('data', (data) => {
        output = output + data.toString('utf8');
      });
      ping.on('close', (data) => {
        let s = 'Sent =';
        let r = 'Received =';
        let sent = Number(output[output.search(s) + s.length + 1]);
        let received = Number(output[output.search(r) + r.length + 1]);
        if (sent > 0 && received > 0) {
          service.status = true;
          success = true;
        } else if (!success) {
          service.status = false;
        }
      });
    });
  });
};

let servicePoller = () => {
  __ServerBOT.updateServices();
  setTimeout(servicePoller, __ServerBOT.config.updateInterval);
};

setTimeout(servicePoller, __ServerBOT.config.updateInterval);
