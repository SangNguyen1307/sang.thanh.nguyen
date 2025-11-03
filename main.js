// 1. Khai báo API Key và "Lấy" các phần tử HTML

// Dán API Key bạn lấy từ OpenWeatherMap vào đây
const API_KEY = 'eb50484fd96b2dc714a9abb30e570dc0'; 

// Lấy các phần tử (elements) mà chúng ta cần tương tác
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherResultDiv = document.getElementById('weather-result');

//2 .Thêm sự kiện "Click" cho nút Tìm

// Thêm một trình lắng nghe sự kiện 'click' cho nút bấm
searchBtn.addEventListener('click', () => {
    // 1. Lấy giá trị (tên thành phố) từ ô input
    const cityName = cityInput.value.trim(); // .trim() để xóa khoảng trắng thừa

    // 2. Kiểm tra xem người dùng có nhập gì không
    if (cityName === '') {
        // Nếu không nhập, báo lỗi
        displayError('Vui lòng nhập tên thành phố!');
        return; // Dừng hàm
    }
    
    // 3. Nếu có nhập, gọi hàm để lấy dữ liệu thời tiết
    fetchWeather(cityName);
});

// 3.  Viết hàm fetchWeather để gọi API (Quan trọng nhất)


// Dùng 'async' để báo cho JS biết hàm này có xử lý bất đồng bộ
async function fetchWeather(city) {
    // 1. Hiển thị thông báo đang tải...
    weatherResultDiv.innerHTML = '<p>Đang tải dữ liệu...</p>';

    // 2. Xây dựng URL để gọi API
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=vi`;
    
    // Dùng try...catch để bắt lỗi (ví dụ: gõ sai tên thành phố, mất mạng)
    try {
        // 3. Dùng 'await fetch' để đợi API trả kết quả
        const response = await fetch(API_URL);
        
        // 4. Kiểm tra xem API có trả về lỗi không (ví dụ: 404 là không tìm thấy)
        if (!response.ok) {
            // Nếu có lỗi, ném (throw) lỗi để 'catch' ở dưới bắt được
            throw new Error('Không tìm thấy thành phố này. Vui lòng thử lại!');
        }

        // 5. Nếu ổn, chuyển dữ liệu trả về thành dạng JSON (đối tượng JS)
        const data = await response.json();
        
        // 6. Gọi hàm hiển thị dữ liệu ra màn hình
        displayWeather(data);

    } catch (error) {
        // 7. Nếu 'try' thất bại (lỗi 404 hoặc lỗi mạng), 'catch' sẽ chạy
        console.error('Đã xảy ra lỗi:', error);
        displayError(error.message); // Hiển thị thông báo lỗi
    }
}

// 4. Viết hàm displayWeather để hiển thị kết quả



function displayWeather(data) {
    // Bóc tách các dữ liệu chúng ta cần từ đối tượng 'data'
    const cityName = data.name;
    const temperature = data.main.temp;
    const description = data.weather[0].description;
    const humidity = data.main.humidity;
    const icon = data.weather[0].icon;

    // Tạo một đường dẫn ảnh icon từ OpenWeatherMap
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    // 1. Tạo một chuỗi HTML để hiển thị
    const htmlContent = `
        <h2>${cityName}</h2>
        <img src="${iconUrl}" alt="Weather icon">
        <p><strong>Nhiệt độ:</strong> ${temperature}°C</p>
        <p><strong>Tình trạng:</strong> ${description}</p>
        <p><strong>Độ ẩm:</strong> ${humidity}%</p>
    `;

    // 2. Gán chuỗi HTML này vào div kết quả
    weatherResultDiv.innerHTML = htmlContent;
}



function displayError(message) {
    // Đơn giản là hiển thị một thông báo lỗi
    weatherResultDiv.innerHTML = `<p style="color: red;">Lỗi: ${message}</p>`;
}