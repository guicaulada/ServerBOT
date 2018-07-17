__ServerBOT.updateServices = () => {
  __ServerBOT.config.services.forEach((service) => {
    let [address, port] = service.address.split(':');
    let ping = __spawn('paping', [address, '-p', port, '-c', 3]);
    let output = '';
    ping.stdout.on('data', (data) => {
      output = output + data.toString('utf8');
    });
    ping.on('close', (data) => {
      if (output.search('Failed = 0') > 0) {
        service.status = true;
      } else if (output.search('Connected = 0') > 0) {
        service.status = false;
      }
    });
  });
};

let servicePoller = () => {
  __ServerBOT.updateServices();
  setTimeout(servicePoller, 10000);
};
servicePoller();
