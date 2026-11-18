const mineflayer = require('mineflayer');
const http = require('http');

const TEN_TAI_KHOAN_CHINH = 'Hungg7'; 

// 1. Tạo một web server nhỏ để Render không bị lỗi cổng (Port)
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot Minecraft đang hoạt động 24/7!');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Web server đang chạy trên cổng ${PORT}`);
});

// 2. Cấu hình Bot Minecraft
const bot = mineflayer.createBot({
  host: 'TTCsmp.asia',
  port: 25565,
  username: 'jane123',
  version: '1.21.11',
  skipValidation: true
});

// Chặn sự kiện tải Resource Pack để tránh bị kẹt
bot._client.on('resource_pack_send', (packet) => {
  console.log('Server yêu cầu tải Resource Pack, bot đã từ chối.');
  bot._client.write('resource_pack_receive', {
    uuid: packet.uuid,
    result: 3
  });
});

bot.once('spawn', () => {
  console.log('Bot đã vào server, chuẩn bị đăng nhập...');

  // Đợi 3 giây rồi tự động gửi lệnh đăng nhập
  setTimeout(() => {
    bot.chat('/login ttc123'); // <-- Nhớ thay mật khẩu thật của bot vào đây
    console.log('Đã gửi lệnh đăng nhập!');
  }, 3000);

  // Chống AFK: Nhảy nhẹ mỗi 30 giây
  setInterval(() => {
    bot.setControlState('jump', true);
    setTimeout(() => bot.setControlState('jump', false), 500);
  }, 30000);
});

// Lắng nghe thông báo từ server để bắt sự kiện /tpa từ Hungg7
bot.on('messagestr', (msg) => {
  console.log('[Server]:', msg);
  
  if (msg.includes(TEN_TAI_KHOAN_CHINH)) {
    console.log('Phát hiện tương tác từ Hungg7, chuẩn bị chấp nhận TPA...');
    
    setTimeout(() => {
      bot.chat('/tpaccept');
      console.log('Đã gửi lệnh /tpaccept!');
    }, 1000);
  }
});

bot.on('kicked', (reason) => console.log('Bị kick vì:', reason));
bot.on('error', (err) => console.log('Lỗi kết nối:', err));