const services = [
  {
    id: 'island',
    name: 'Ark - The Island',
    port: 22323,
    start: 'D:\\MEGAsync\\LIBRARY\\Ark-Servers\\ark\\ShooterGame\\Saved\\Config\\WindowsServer\\RunServer.bat',
  },
  {
    id: 'altis',
    name: 'Arma 3 Exile',
    port: 24666,
    start: 'D:\\SIGHMIR\\arma3\\ExileAltis.bat',
    keepAlive: true,
  },
  {
    id: 'tanoa',
    name: 'Arma 3 Tanoa',
    port: 25666,
    start: 'D:\\SIGHMIR\\arma3\\ExileTanoa.bat',
  },
  {
    id: 'chernarus',
    name: 'Arma 3 Chernarus',
    port: 26666,
    start: 'D:\\SIGHMIR\\arma3\\ExileChernarus.bat',
  },
  {
    id: '7d2d',
    match: '7daystodie',
    name: '7 Days 2 Die',
    port: 26910,
    start: 'D:\\SIGHMIR\\7days2die\\7Days2DieLauncher.bat',
  },
  {
    id: 'rust',
    name: 'Rust',
    port: 28016,
    start: 'D:\\MEGAsync\\LIBRARY\\rustserver\\RustLauncher.bat',
  },
  {
    id: 'minecraft',
    match: 'java',
    name: 'Minecraft',
    port: 25565,
    start: 'D:\\MEGAsync\\LIBRARY\\minecraft\\McMyAdmin\\McMyAdminLauncher.bat',
  },
  {
    id: 'redis',
    name: 'Redis',
    port: 6379,
    start: 'D:\\SIGHMIR\\Scripts\\RedisLauncher.bat',
  },
  {
    id: 'mysql',
    name: 'MySQL',
    port: 3306,
    start: 'D:\\SIGHMIR\\Scripts\\MySQLLauncher.bat',
  },
  {
    id: 'prometheus',
    name: 'Prometheus',
    port: 9090,
    start: 'D:\\SIGHMIR\\Scripts\\PrometheusLauncher.bat',
  },
];

module.exports = services;
