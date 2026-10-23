/* Original study material. Each topic has 12 focus words; a session mixes 50 focus and related/review words. */
const COURSE_SEED = [
['Hợp đồng','Contracts','Kinh doanh',`
agreement|əˈɡriːmənt|n.|thỏa thuận|review the agreement|xem lại thỏa thuận
contract|ˈkɑːntrækt|n.|hợp đồng|sign the contract|ký hợp đồng
clause|klɔːz|n.|điều khoản|read each clause carefully|đọc kỹ từng điều khoản
negotiate|nɪˈɡoʊʃieɪt|v.|đàm phán|negotiate a better price|đàm phán mức giá tốt hơn
obligation|ˌɑːblɪˈɡeɪʃən|n.|nghĩa vụ|explain the legal obligation|giải thích nghĩa vụ pháp lý
valid|ˈvælɪd|adj.|có hiệu lực|check whether the permit is valid|kiểm tra xem giấy phép có hiệu lực không
terminate|ˈtɜːrmɪneɪt|v.|chấm dứt|terminate the rental agreement|chấm dứt hợp đồng thuê
renew|rɪˈnuː|v.|gia hạn|renew the service contract|gia hạn hợp đồng dịch vụ
signature|ˈsɪɡnətʃər|n.|chữ ký|add your signature here|thêm chữ ký của bạn vào đây
condition|kənˈdɪʃən|n.|điều kiện|clarify this payment condition|làm rõ điều kiện thanh toán này
amendment|əˈmendmənt|n.|bản sửa đổi|approve the amendment|phê duyệt bản sửa đổi
consent|kənˈsent|n.|sự đồng ý|obtain written consent|nhận sự đồng ý bằng văn bản
`],
['Tiếp thị','Marketing','Kinh doanh',`
advertisement|ˌædvərˈtaɪzmənt|n.|quảng cáo|publish the advertisement online|đăng quảng cáo trực tuyến
campaign|kæmˈpeɪn|n.|chiến dịch|launch a new campaign|triển khai chiến dịch mới
consumer|kənˈsuːmər|n.|người tiêu dùng|protect the consumer|bảo vệ người tiêu dùng
brand|brænd|n.|thương hiệu|promote the brand locally|quảng bá thương hiệu tại địa phương
survey|ˈsɜːrveɪ|n.|khảo sát|complete the customer survey|hoàn thành khảo sát khách hàng
strategy|ˈstrætədʒi|n.|chiến lược|develop a marketing strategy|xây dựng chiến lược tiếp thị
launch|lɔːntʃ|v.|ra mắt|launch the new product|ra mắt sản phẩm mới
promote|prəˈmoʊt|v.|quảng bá|promote our online services|quảng bá dịch vụ trực tuyến của chúng ta
audience|ˈɔːdiəns|n.|đối tượng tiếp nhận|identify the target audience|xác định đối tượng mục tiêu
competitor|kəmˈpetɪtər|n.|đối thủ cạnh tranh|study our main competitor|nghiên cứu đối thủ cạnh tranh chính
awareness|əˈwernəs|n.|sự nhận biết|increase brand awareness|tăng mức độ nhận biết thương hiệu
slogan|ˈsloʊɡən|n.|khẩu hiệu|choose a memorable slogan|chọn một khẩu hiệu dễ nhớ
`],
['Bảo hành','Warranties','Kinh doanh',`
warranty|ˈwɔːrənti|n.|bảo hành|check the warranty period|kiểm tra thời hạn bảo hành
coverage|ˈkʌvərɪdʒ|n.|phạm vi bảo hành, bảo hiểm|confirm the coverage details|xác nhận chi tiết phạm vi bảo hành
defect|ˈdiːfekt|n.|lỗi sản phẩm|report the manufacturing defect|báo cáo lỗi sản xuất
replace|rɪˈpleɪs|v.|thay thế|replace the damaged device|thay thiết bị bị hỏng
refund|ˈriːfʌnd|n.|khoản hoàn tiền|request a full refund|yêu cầu hoàn tiền toàn bộ
repair|rɪˈper|v.|sửa chữa|repair the office printer|sửa máy in văn phòng
receipt|rɪˈsiːt|n.|biên lai|keep the original receipt|giữ lại biên lai gốc
expire|ɪkˈspaɪər|v.|hết hạn|check when the warranty will expire|kiểm tra khi nào bảo hành hết hạn
guarantee|ˌɡærənˈtiː|n.|sự bảo đảm|read the satisfaction guarantee|đọc cam kết bảo đảm sự hài lòng
proof|pruːf|n.|bằng chứng|provide proof of purchase|cung cấp bằng chứng mua hàng
eligible|ˈelɪdʒəbəl|adj.|đủ điều kiện|check whether you are eligible|kiểm tra xem bạn có đủ điều kiện không
limitation|ˌlɪmɪˈteɪʃən|n.|giới hạn|explain the warranty limitation|giải thích giới hạn bảo hành
`],
['Lập kế hoạch','Business planning','Kinh doanh',`
objective|əbˈdʒektɪv|n.|mục tiêu|set a clear objective|đặt mục tiêu rõ ràng
budget|ˈbʌdʒɪt|n.|ngân sách|prepare the annual budget|lập ngân sách hằng năm
deadline|ˈdedlaɪn|n.|hạn chót|meet the project deadline|hoàn thành đúng hạn dự án
proposal|prəˈpoʊzəl|n.|đề xuất|submit the business proposal|nộp đề xuất kinh doanh
forecast|ˈfɔːrkæst|n.|dự báo|update the sales forecast|cập nhật dự báo doanh số
allocate|ˈæləkeɪt|v.|phân bổ|allocate more resources|phân bổ thêm nguồn lực
priority|praɪˈɔːrəti|n.|ưu tiên|decide our top priority|xác định ưu tiên hàng đầu
feasible|ˈfiːzəbəl|adj.|khả thi|check whether the plan is feasible|kiểm tra xem kế hoạch có khả thi không
milestone|ˈmaɪlstoʊn|n.|cột mốc|celebrate the first milestone|ăn mừng cột mốc đầu tiên
implement|ˈɪmplɪment|v.|triển khai|implement the new policy|triển khai chính sách mới
resource|ˈriːsɔːrs|n.|nguồn lực|use each resource wisely|sử dụng từng nguồn lực hợp lý
evaluate|ɪˈvæljueɪt|v.|đánh giá|evaluate the project results|đánh giá kết quả dự án
`],
['Hội nghị','Conferences','Kinh doanh',`
conference|ˈkɑːnfərəns|n.|hội nghị|attend the annual conference|tham dự hội nghị hằng năm
agenda|əˈdʒendə|n.|chương trình nghị sự|review the meeting agenda|xem lại chương trình họp
venue|ˈvenjuː|n.|địa điểm tổ chức|book a larger venue|đặt địa điểm tổ chức lớn hơn
participant|pɑːrˈtɪsɪpənt|n.|người tham gia|welcome each participant|chào đón từng người tham gia
register|ˈredʒɪstər|v.|đăng ký|register for the workshop|đăng ký hội thảo thực hành
speaker|ˈspiːkər|n.|diễn giả|introduce the guest speaker|giới thiệu diễn giả khách mời
session|ˈseʃən|n.|phiên, buổi|join the afternoon session|tham gia phiên buổi chiều
badge|bædʒ|n.|thẻ tên|wear your conference badge|đeo thẻ tên hội nghị
presentation|ˌprezənˈteɪʃən|n.|bài thuyết trình|prepare a short presentation|chuẩn bị bài thuyết trình ngắn
handout|ˈhændaʊt|n.|tài liệu phát tay|read the workshop handout|đọc tài liệu phát tay của hội thảo
network|ˈnetwɜːrk|v.|xây dựng quan hệ|network with other professionals|kết nối với các chuyên gia khác
moderator|ˈmɑːdəreɪtər|n.|người điều phối|thank the discussion moderator|cảm ơn người điều phối thảo luận
`],
['Máy tính','Computers','Văn phòng',`
software|ˈsɔːftwer|n.|phần mềm|install the accounting software|cài đặt phần mềm kế toán
hardware|ˈhɑːrdwer|n.|phần cứng|upgrade the computer hardware|nâng cấp phần cứng máy tính
password|ˈpæswɜːrd|n.|mật khẩu|change your password regularly|thay đổi mật khẩu thường xuyên
backup|ˈbækʌp|n.|bản sao lưu|create a backup of the files|tạo bản sao lưu các tệp
database|ˈdeɪtəbeɪs|n.|cơ sở dữ liệu|update the customer database|cập nhật cơ sở dữ liệu khách hàng
install|ɪnˈstɔːl|v.|cài đặt|install the latest update|cài đặt bản cập nhật mới nhất
access|ˈækses|v.|truy cập|access the shared folder|truy cập thư mục dùng chung
keyboard|ˈkiːbɔːrd|n.|bàn phím|clean the keyboard carefully|vệ sinh bàn phím cẩn thận
monitor|ˈmɑːnɪtər|n.|màn hình|connect the external monitor|kết nối màn hình ngoài
file|faɪl|n.|tệp|save the file securely|lưu tệp an toàn
browser|ˈbraʊzər|n.|trình duyệt|open the browser settings|mở cài đặt trình duyệt
storage|ˈstɔːrɪdʒ|n.|dung lượng lưu trữ|check the available storage|kiểm tra dung lượng lưu trữ còn trống
`],
['Công nghệ văn phòng','Office technology','Văn phòng',`
printer|ˈprɪntər|n.|máy in|connect the wireless printer|kết nối máy in không dây
scanner|ˈskænər|n.|máy quét|use the document scanner|sử dụng máy quét tài liệu
projector|prəˈdʒektər|n.|máy chiếu|set up the projector|lắp đặt máy chiếu
equipment|ɪˈkwɪpmənt|n.|thiết bị|inspect the office equipment|kiểm tra thiết bị văn phòng
automate|ˈɔːtəmeɪt|v.|tự động hóa|automate the reporting process|tự động hóa quy trình báo cáo
compatible|kəmˈpætəbəl|adj.|tương thích|check whether the devices are compatible|kiểm tra xem các thiết bị có tương thích không
connection|kəˈnekʃən|n.|kết nối|test the internet connection|kiểm tra kết nối internet
wireless|ˈwaɪərləs|adj.|không dây|choose a wireless device|chọn thiết bị không dây
troubleshoot|ˈtrʌbəlʃuːt|v.|xử lý sự cố|troubleshoot the network problem|xử lý sự cố mạng
upgrade|ʌpˈɡreɪd|v.|nâng cấp|upgrade the security system|nâng cấp hệ thống bảo mật
outlet|ˈaʊtlet|n.|ổ cắm điện|find an available power outlet|tìm ổ cắm điện còn trống
maintenance|ˈmeɪntənəns|n.|bảo trì|schedule regular maintenance|lên lịch bảo trì định kỳ
`],
['Quy trình văn phòng','Office procedures','Văn phòng',`
procedure|prəˈsiːdʒər|n.|quy trình|follow the safety procedure|tuân thủ quy trình an toàn
policy|ˈpɑːləsi|n.|chính sách|explain the attendance policy|giải thích chính sách chuyên cần
approval|əˈpruːvəl|n.|sự phê duyệt|get the manager's approval|xin phê duyệt của quản lý
submit|səbˈmɪt|v.|nộp|submit the monthly report|nộp báo cáo tháng
schedule|ˈskedʒuːl|n.|lịch trình|check the work schedule|kiểm tra lịch làm việc
assign|əˈsaɪn|v.|giao việc|assign the task to a colleague|giao nhiệm vụ cho đồng nghiệp
record|ˈrekərd|n.|hồ sơ, bản ghi|keep an accurate record|lưu hồ sơ chính xác
confidential|ˌkɑːnfɪˈdenʃəl|adj.|bảo mật|keep the report confidential|giữ bí mật báo cáo
comply|kəmˈplaɪ|v.|tuân thủ|comply with company regulations|tuân thủ quy định công ty
reception|rɪˈsepʃən|n.|quầy lễ tân|leave the package at reception|để kiện hàng tại quầy lễ tân
supervisor|ˈsuːpərvaɪzər|n.|người giám sát|contact your supervisor|liên hệ người giám sát của bạn
stationery|ˈsteɪʃəneri|n.|văn phòng phẩm|order more stationery|đặt thêm văn phòng phẩm
`],
['Thiết bị điện tử','Electronics','Văn phòng',`
device|dɪˈvaɪs|n.|thiết bị|turn off the device|tắt thiết bị
battery|ˈbætəri|n.|pin|charge the battery fully|sạc đầy pin
charger|ˈtʃɑːrdʒər|n.|bộ sạc|bring a spare charger|mang theo bộ sạc dự phòng
portable|ˈpɔːrtəbəl|adj.|di động, dễ mang|choose a portable speaker|chọn loa di động
feature|ˈfiːtʃər|n.|tính năng|test the new feature|kiểm tra tính năng mới
manual|ˈmænjuəl|n.|sách hướng dẫn|read the instruction manual|đọc sách hướng dẫn sử dụng
operate|ˈɑːpəreɪt|v.|vận hành|operate the machine safely|vận hành máy an toàn
switch|swɪtʃ|n.|công tắc|locate the power switch|tìm công tắc nguồn
cable|ˈkeɪbəl|n.|dây cáp|replace the damaged cable|thay dây cáp bị hỏng
sensor|ˈsensər|n.|cảm biến|adjust the motion sensor|điều chỉnh cảm biến chuyển động
screen|skriːn|n.|màn hình hiển thị|clean the screen gently|lau nhẹ màn hình hiển thị
specification|ˌspesɪfɪˈkeɪʃən|n.|thông số kỹ thuật|check each technical specification|kiểm tra từng thông số kỹ thuật
`],
['Thư tín công việc','Correspondence','Văn phòng',`
correspondence|ˌkɔːrəˈspɑːndəns|n.|thư từ trao đổi|organize the business correspondence|sắp xếp thư từ công việc
recipient|rɪˈsɪpiənt|n.|người nhận|confirm the recipient's address|xác nhận địa chỉ người nhận
attachment|əˈtætʃmənt|n.|tệp đính kèm|open the email attachment|mở tệp đính kèm email
inquiry|ˈɪnkwəri|n.|yêu cầu thông tin|respond to the customer inquiry|trả lời yêu cầu thông tin của khách hàng
reply|rɪˈplaɪ|v.|trả lời|reply to the supplier promptly|trả lời nhà cung cấp kịp thời
forward|ˈfɔːrwərd|v.|chuyển tiếp|forward the message to sales|chuyển tiếp tin nhắn đến bộ phận bán hàng
address|ˈædres|n.|địa chỉ|verify the mailing address|xác minh địa chỉ gửi thư
envelope|ˈenvəloʊp|n.|phong bì|seal the envelope carefully|dán kín phong bì cẩn thận
postage|ˈpoʊstɪdʒ|n.|cước bưu chính|calculate the required postage|tính cước bưu chính cần trả
courteous|ˈkɜːrtiəs|adj.|lịch sự|write a courteous reply|viết câu trả lời lịch sự
acknowledge|əkˈnɑːlɪdʒ|v.|xác nhận đã nhận|acknowledge receipt of the letter|xác nhận đã nhận thư
promptly|ˈprɑːmptli|adv.|kịp thời|answer the message promptly|trả lời tin nhắn kịp thời
`],
['Tuyển dụng','Recruitment','Công việc',`
vacancy|ˈveɪkənsi|n.|vị trí trống|advertise the job vacancy|đăng tuyển vị trí còn trống
applicant|ˈæplɪkənt|n.|ứng viên nộp đơn|contact the successful applicant|liên hệ ứng viên trúng tuyển
qualification|ˌkwɑːlɪfɪˈkeɪʃən|n.|bằng cấp, trình độ|check each applicant's qualification|kiểm tra trình độ của từng ứng viên
recruit|rɪˈkruːt|v.|tuyển dụng|recruit experienced engineers|tuyển kỹ sư có kinh nghiệm
position|pəˈzɪʃən|n.|vị trí công việc|apply for the management position|ứng tuyển vị trí quản lý
requirement|rɪˈkwaɪərmənt|n.|yêu cầu|clarify the language requirement|làm rõ yêu cầu ngôn ngữ
candidate|ˈkændɪdət|n.|ứng viên|interview the final candidate|phỏng vấn ứng viên cuối cùng
experience|ɪkˈspɪriəns|n.|kinh nghiệm|describe your previous experience|mô tả kinh nghiệm trước đây của bạn
reference|ˈrefərəns|n.|người tham chiếu, thư giới thiệu|provide a professional reference|cung cấp người tham chiếu trong công việc
shortlist|ˈʃɔːrtlɪst|n.|danh sách rút gọn|prepare the candidate shortlist|chuẩn bị danh sách ứng viên rút gọn
employment|ɪmˈplɔɪmənt|n.|việc làm|discuss future employment opportunities|thảo luận cơ hội việc làm sắp tới
skill|skɪl|n.|kỹ năng|develop a useful communication skill|phát triển một kỹ năng giao tiếp hữu ích
`],
['Hồ sơ & phỏng vấn','Applications & interviews','Công việc',`
resume|ˈrezəmeɪ|n.|sơ yếu lý lịch|update your resume|cập nhật sơ yếu lý lịch
interview|ˈɪntərvjuː|n.|buổi phỏng vấn|prepare for the interview|chuẩn bị cho buổi phỏng vấn
application|ˌæplɪˈkeɪʃən|n.|đơn ứng tuyển|complete the application form|điền đầy đủ đơn ứng tuyển
portfolio|pɔːrtˈfoʊlioʊ|n.|hồ sơ năng lực|bring your design portfolio|mang theo hồ sơ năng lực thiết kế
accomplishment|əˈkɑːmplɪʃmənt|n.|thành tích|describe your greatest accomplishment|mô tả thành tích lớn nhất của bạn
strength|streŋθ|n.|điểm mạnh|explain your main strength|giải thích điểm mạnh chính của bạn
weakness|ˈwiːknəs|n.|điểm yếu|identify an area of weakness|xác định một điểm yếu
confident|ˈkɑːnfɪdənt|adj.|tự tin|remain confident during the interview|giữ tự tin trong buổi phỏng vấn
professional|prəˈfeʃənəl|adj.|chuyên nghiệp|maintain a professional attitude|duy trì thái độ chuyên nghiệp
impression|ɪmˈpreʃən|n.|ấn tượng|make a positive first impression|tạo ấn tượng đầu tiên tích cực
availability|əˌveɪləˈbɪləti|n.|thời gian có thể sắp xếp|confirm your availability for Monday|xác nhận bạn có thể sắp xếp thời gian vào thứ Hai
follow-up|ˈfɑːloʊ ʌp|n.|việc trao đổi tiếp sau|send a follow-up email|gửi email trao đổi tiếp sau
`],
['Nhận việc & đào tạo','Hiring & training','Công việc',`
orientation|ˌɔːriənˈteɪʃən|n.|buổi định hướng|attend the staff orientation|tham dự buổi định hướng nhân viên
trainee|ˌtreɪˈniː|n.|học viên, nhân viên tập sự|support the new trainee|hỗ trợ nhân viên tập sự mới
mentor|ˈmentɔːr|n.|người hướng dẫn|meet your assigned mentor|gặp người hướng dẫn được chỉ định
probation|proʊˈbeɪʃən|n.|thời gian thử việc|complete the probation period|hoàn thành thời gian thử việc
onboarding|ˈɑːnbɔːrdɪŋ|n.|quá trình tiếp nhận nhân viên mới|improve the onboarding process|cải thiện quá trình tiếp nhận nhân viên mới
workshop|ˈwɜːrkʃɑːp|n.|buổi học thực hành|attend the leadership workshop|tham dự buổi học thực hành về lãnh đạo
instruction|ɪnˈstrʌkʃən|n.|hướng dẫn|follow each instruction carefully|làm theo từng hướng dẫn cẩn thận
feedback|ˈfiːdbæk|n.|phản hồi|give constructive feedback|đưa ra phản hồi mang tính xây dựng
competence|ˈkɑːmpɪtəns|n.|năng lực|demonstrate your technical competence|thể hiện năng lực kỹ thuật của bạn
adapt|əˈdæpt|v.|thích nghi|adapt to the new workplace|thích nghi với nơi làm việc mới
instructor|ɪnˈstrʌktər|n.|người đào tạo|ask the instructor for help|nhờ người đào tạo giúp đỡ
assessment|əˈsesmənt|n.|bài đánh giá|complete the training assessment|hoàn thành bài đánh giá đào tạo
`],
['Lương & phúc lợi','Salaries & benefits','Công việc',`
salary|ˈsæləri|n.|lương cố định|discuss the starting salary|thảo luận mức lương khởi điểm
wage|weɪdʒ|n.|tiền công|calculate the hourly wage|tính tiền công theo giờ
payroll|ˈpeɪroʊl|n.|bảng lương|check the monthly payroll|kiểm tra bảng lương tháng
bonus|ˈboʊnəs|n.|tiền thưởng|announce the annual bonus|thông báo tiền thưởng hằng năm
benefit|ˈbenɪfɪt|n.|phúc lợi|explain the health benefit|giải thích phúc lợi sức khỏe
overtime|ˈoʊvərtaɪm|n.|giờ làm thêm|record your overtime accurately|ghi chính xác giờ làm thêm
allowance|əˈlaʊəns|n.|phụ cấp|claim the travel allowance|yêu cầu thanh toán phụ cấp đi lại
deduction|dɪˈdʌkʃən|n.|khoản khấu trừ|review the tax deduction|xem lại khoản khấu trừ thuế
compensation|ˌkɑːmpənˈseɪʃən|n.|chế độ đãi ngộ|review the compensation package|xem lại gói đãi ngộ
leave|liːv|n.|ngày nghỉ phép|request annual leave|xin nghỉ phép năm
reimburse|ˌriːɪmˈbɜːrs|v.|hoàn trả chi phí|reimburse the travel expenses|hoàn trả chi phí đi lại
payslip|ˈpeɪslɪp|n.|phiếu lương|download your latest payslip|tải phiếu lương mới nhất của bạn
`],
['Thăng tiến & ghi nhận','Career growth','Công việc',`
promotion|prəˈmoʊʃən|n.|sự thăng chức|apply for a promotion|ứng tuyển để được thăng chức
pension|ˈpenʃən|n.|lương hưu|review the company pension plan|xem lại kế hoạch lương hưu của công ty
retirement|rɪˈtaɪərmənt|n.|sự nghỉ hưu|plan for your retirement|lập kế hoạch nghỉ hưu
recognition|ˌrekəɡˈnɪʃən|n.|sự ghi nhận|give employees proper recognition|ghi nhận nhân viên một cách xứng đáng
achievement|əˈtʃiːvmənt|n.|thành tựu|celebrate the team's achievement|ăn mừng thành tựu của nhóm
performance|pərˈfɔːrməns|n.|hiệu suất|improve overall performance|cải thiện hiệu suất tổng thể
leadership|ˈliːdərʃɪp|n.|khả năng lãnh đạo|develop strong leadership skills|phát triển kỹ năng lãnh đạo vững vàng
reward|rɪˈwɔːrd|n.|phần thưởng|offer a meaningful reward|trao phần thưởng có ý nghĩa
seniority|ˌsiːniˈɔːrəti|n.|thâm niên|consider each employee's seniority|xem xét thâm niên của từng nhân viên
advancement|ədˈvænsmənt|n.|sự tiến bộ, thăng tiến|discuss career advancement|thảo luận về thăng tiến nghề nghiệp
dedication|ˌdedɪˈkeɪʃən|n.|sự tận tâm|appreciate the staff's dedication|trân trọng sự tận tâm của nhân viên
appraisal|əˈpreɪzəl|n.|buổi đánh giá nhân viên|prepare for the annual appraisal|chuẩn bị cho buổi đánh giá nhân viên hằng năm
`],
['Mua sắm','Shopping','Mua bán',`
purchase|ˈpɜːrtʃəs|n.|giao dịch mua|confirm your online purchase|xác nhận giao dịch mua trực tuyến
retailer|ˈriːteɪlər|n.|nhà bán lẻ|contact the local retailer|liên hệ nhà bán lẻ địa phương
discount|ˈdɪskaʊnt|n.|khoản giảm giá|ask for a volume discount|xin giảm giá khi mua số lượng lớn
merchandise|ˈmɜːrtʃəndaɪz|n.|hàng hóa bày bán|display the new merchandise|trưng bày hàng hóa mới
bargain|ˈbɑːrɡən|n.|món hời|look for a genuine bargain|tìm một món hời thực sự
checkout|ˈtʃekaʊt|n.|quầy thanh toán|go to the nearest checkout|đến quầy thanh toán gần nhất
customer|ˈkʌstəmər|n.|khách hàng|assist the waiting customer|hỗ trợ khách hàng đang chờ
browse|braʊz|v.|xem lướt, xem hàng|browse the online catalog|xem danh mục trực tuyến
return|rɪˈtɜːrn|v.|trả lại|return the unwanted item|trả lại món hàng không cần
price|praɪs|n.|giá|compare the total price|so sánh tổng giá
loyalty|ˈlɔɪəlti|n.|sự trung thành|join the store's loyalty program|tham gia chương trình khách hàng thân thiết
coupon|ˈkuːpɑːn|n.|phiếu giảm giá|use the discount coupon|sử dụng phiếu giảm giá
`],
['Đặt hàng & vật tư','Ordering supplies','Mua bán',`
supplier|səˈplaɪər|n.|nhà cung cấp|contact the stationery supplier|liên hệ nhà cung cấp văn phòng phẩm
catalog|ˈkætəlɔːɡ|n.|danh mục sản phẩm|request the latest catalog|yêu cầu danh mục sản phẩm mới nhất
quantity|ˈkwɑːntəti|n.|số lượng|confirm the required quantity|xác nhận số lượng cần thiết
bulk|bʌlk|n.|số lượng lớn|buy paper in bulk|mua giấy với số lượng lớn
requisition|ˌrekwɪˈzɪʃən|n.|phiếu yêu cầu vật tư|submit the supply requisition|nộp phiếu yêu cầu vật tư
quote|kwoʊt|n.|báo giá|request a written quote|yêu cầu báo giá bằng văn bản
wholesale|ˈhoʊlseɪl|adj.|bán buôn|compare wholesale prices|so sánh giá bán buôn
restock|ˌriːˈstɑːk|v.|bổ sung hàng|restock the office supplies|bổ sung vật tư văn phòng
minimum|ˈmɪnɪməm|adj.|tối thiểu|check the minimum order size|kiểm tra quy mô đơn hàng tối thiểu
vendor|ˈvendər|n.|bên bán|select a reliable vendor|chọn bên bán đáng tin cậy
fulfill|fʊlˈfɪl|v.|thực hiện, đáp ứng|fulfill the customer's order|thực hiện đơn hàng của khách
procurement|prəˈkjʊrmənt|n.|hoạt động thu mua|review the procurement process|xem lại quy trình thu mua
`],
['Vận chuyển','Shipping','Mua bán',`
shipment|ˈʃɪpmənt|n.|lô hàng vận chuyển|track the international shipment|theo dõi lô hàng quốc tế
delivery|dɪˈlɪvəri|n.|việc giao hàng|confirm the delivery date|xác nhận ngày giao hàng
freight|freɪt|n.|hàng vận tải, cước vận tải|calculate the freight charges|tính phí vận tải
warehouse|ˈwerhaʊs|n.|kho hàng|inspect the distribution warehouse|kiểm tra kho phân phối
customs|ˈkʌstəmz|n.|hải quan|prepare the customs documents|chuẩn bị giấy tờ hải quan
tracking|ˈtrækɪŋ|n.|việc theo dõi|check the tracking number|kiểm tra mã theo dõi
parcel|ˈpɑːrsəl|n.|bưu kiện|weigh the parcel carefully|cân bưu kiện cẩn thận
carrier|ˈkæriər|n.|đơn vị vận chuyển|choose a reliable carrier|chọn đơn vị vận chuyển đáng tin cậy
dispatch|dɪˈspætʃ|v.|gửi đi|dispatch the order today|gửi đơn hàng đi hôm nay
fragile|ˈfrædʒəl|adj.|dễ vỡ|label the fragile package|dán nhãn kiện hàng dễ vỡ
destination|ˌdestɪˈneɪʃən|n.|điểm đến|confirm the final destination|xác nhận điểm đến cuối cùng
transit|ˈtrænzɪt|n.|sự vận chuyển, quá cảnh|check the transit time|kiểm tra thời gian vận chuyển
`],
['Hóa đơn & thanh toán','Invoices','Mua bán',`
invoice|ˈɪnvɔɪs|n.|hóa đơn thanh toán|send the revised invoice|gửi hóa đơn đã điều chỉnh
payment|ˈpeɪmənt|n.|khoản thanh toán|confirm receipt of payment|xác nhận đã nhận khoản thanh toán
balance|ˈbæləns|n.|số dư, số tiền còn lại|pay the outstanding balance|thanh toán số tiền còn lại
overdue|ˌoʊvərˈduː|adj.|quá hạn|settle the overdue invoice|thanh toán hóa đơn quá hạn
charge|tʃɑːrdʒ|n.|khoản phí|explain the additional charge|giải thích khoản phí bổ sung
bill|bɪl|n.|hóa đơn tính tiền|check the electricity bill|kiểm tra hóa đơn điện
transaction|trænˈzækʃən|n.|giao dịch|verify the bank transaction|xác minh giao dịch ngân hàng
remittance|rɪˈmɪtəns|n.|khoản tiền chuyển|confirm the remittance details|xác nhận thông tin khoản tiền chuyển
installment|ɪnˈstɔːlmənt|n.|khoản trả góp|pay the first installment|trả khoản trả góp đầu tiên
settle|ˈsetəl|v.|thanh toán dứt điểm|settle the account in full|thanh toán toàn bộ công nợ
itemize|ˈaɪtəmaɪz|v.|liệt kê từng khoản|itemize the service charges|liệt kê từng khoản phí dịch vụ
discrepancy|dɪˈskrepənsi|n.|sự sai lệch|resolve the billing discrepancy|giải quyết sai lệch trên hóa đơn
`],
['Quản lý tồn kho','Inventory','Mua bán',`
inventory|ˈɪnvəntɔːri|n.|hàng tồn kho|check the inventory levels|kiểm tra mức tồn kho
stock|stɑːk|n.|hàng dự trữ|count the remaining stock|đếm hàng dự trữ còn lại
shortage|ˈʃɔːrtɪdʒ|n.|sự thiếu hụt|report the material shortage|báo cáo tình trạng thiếu vật liệu
surplus|ˈsɜːrpləs|n.|lượng dư thừa|reduce the inventory surplus|giảm lượng hàng tồn dư
replenish|rɪˈplenɪʃ|v.|bổ sung|replenish the stock regularly|bổ sung hàng dự trữ thường xuyên
barcode|ˈbɑːrkoʊd|n.|mã vạch|scan the product barcode|quét mã vạch sản phẩm
shelf|ʃelf|n.|kệ|label each storage shelf|dán nhãn từng kệ lưu trữ
turnover|ˈtɜːrnoʊvər|n.|vòng quay hàng hóa|improve inventory turnover|cải thiện vòng quay hàng tồn kho
perishable|ˈperɪʃəbəl|adj.|dễ hỏng|store perishable goods properly|bảo quản hàng dễ hỏng đúng cách
batch|bætʃ|n.|lô sản xuất|inspect the latest batch|kiểm tra lô sản xuất mới nhất
accurate|ˈækjərət|adj.|chính xác|keep the stock count accurate|giữ số liệu kiểm đếm hàng chính xác
obsolete|ˌɑːbsəˈliːt|adj.|lỗi thời|remove obsolete items from storage|loại bỏ mặt hàng lỗi thời khỏi kho
`],
['Ngân hàng','Banking','Tài chính',`
account|əˈkaʊnt|n.|tài khoản|open a savings account|mở tài khoản tiết kiệm
deposit|dɪˈpɑːzɪt|n.|khoản tiền gửi|make a cash deposit|gửi một khoản tiền mặt
withdraw|wɪðˈdrɔː|v.|rút tiền|withdraw cash from the machine|rút tiền từ máy
transfer|trænsˈfɜːr|v.|chuyển tiền|transfer funds to the supplier|chuyển tiền cho nhà cung cấp
interest|ˈɪntrəst|n.|lãi suất, tiền lãi|compare the interest rates|so sánh lãi suất
loan|loʊn|n.|khoản vay|apply for a business loan|nộp đơn vay vốn kinh doanh
branch|bræntʃ|n.|chi nhánh|visit the nearest bank branch|đến chi nhánh ngân hàng gần nhất
currency|ˈkɜːrənsi|n.|tiền tệ|exchange foreign currency|đổi ngoại tệ
statement|ˈsteɪtmənt|n.|bản sao kê|review your bank statement|xem lại sao kê ngân hàng
fee|fiː|n.|phí|check the monthly service fee|kiểm tra phí dịch vụ hằng tháng
savings|ˈseɪvɪŋz|n.|tiền tiết kiệm|protect your personal savings|bảo vệ tiền tiết kiệm cá nhân
borrower|ˈbɑːroʊər|n.|người vay|verify the borrower's identity|xác minh danh tính người vay
`],
['Kế toán','Accounting','Tài chính',`
accountant|əˈkaʊntənt|n.|kế toán viên|consult the company accountant|tham khảo kế toán viên của công ty
ledger|ˈledʒər|n.|sổ cái|update the general ledger|cập nhật sổ cái
expense|ɪkˈspens|n.|chi phí|record each business expense|ghi lại từng chi phí kinh doanh
revenue|ˈrevənuː|n.|doanh thu|calculate the annual revenue|tính doanh thu hằng năm
profit|ˈprɑːfɪt|n.|lợi nhuận|compare the quarterly profit|so sánh lợi nhuận theo quý
audit|ˈɔːdɪt|n.|cuộc kiểm toán|prepare for the financial audit|chuẩn bị cho cuộc kiểm toán tài chính
asset|ˈæset|n.|tài sản|record the value of each asset|ghi giá trị của từng tài sản
liability|ˌlaɪəˈbɪləti|n.|khoản nợ phải trả|report each financial liability|báo cáo từng khoản nợ phải trả
bookkeeping|ˈbʊkkiːpɪŋ|n.|việc ghi sổ kế toán|simplify the bookkeeping process|đơn giản hóa quy trình ghi sổ kế toán
reconcile|ˈrekənsaɪl|v.|đối chiếu|reconcile the two accounts|đối chiếu hai tài khoản
depreciation|dɪˌpriːʃiˈeɪʃən|n.|khấu hao|calculate the equipment depreciation|tính khấu hao thiết bị
fiscal|ˈfɪskəl|adj.|thuộc năm tài chính|review the fiscal year results|xem lại kết quả năm tài chính
`],
['Đầu tư','Investments','Tài chính',`
investment|ɪnˈvestmənt|n.|khoản đầu tư|evaluate the proposed investment|đánh giá khoản đầu tư được đề xuất
shareholder|ˈʃerhoʊldər|n.|cổ đông|inform each shareholder|thông báo cho từng cổ đông
dividend|ˈdɪvɪdend|n.|cổ tức|announce the annual dividend|thông báo cổ tức hằng năm
bond|bɑːnd|n.|trái phiếu|review the bond maturity date|xem ngày đáo hạn trái phiếu
risk|rɪsk|n.|rủi ro|assess the financial risk|đánh giá rủi ro tài chính
capital|ˈkæpɪtəl|n.|vốn|raise capital for expansion|huy động vốn để mở rộng
fund|fʌnd|n.|quỹ|review the investment fund report|xem báo cáo quỹ đầu tư
yield|jiːld|n.|lợi suất|calculate the annual yield|tính lợi suất hằng năm
equity|ˈekwəti|n.|vốn chủ sở hữu|calculate the company's equity|tính vốn chủ sở hữu của công ty
broker|ˈbroʊkər|n.|nhà môi giới|contact a licensed broker|liên hệ nhà môi giới có giấy phép
diversify|daɪˈvɜːrsɪfaɪ|v.|đa dạng hóa|diversify the investment portfolio|đa dạng hóa danh mục đầu tư
maturity|məˈtʃʊrəti|n.|thời điểm đáo hạn|check the deposit maturity date|kiểm tra ngày đáo hạn tiền gửi
`],
['Thuế','Taxes','Tài chính',`
tax|tæks|n.|thuế|calculate the income tax|tính thuế thu nhập
taxpayer|ˈtækspeɪər|n.|người nộp thuế|verify the taxpayer information|xác minh thông tin người nộp thuế
exemption|ɪɡˈzempʃən|n.|sự miễn trừ|apply for a tax exemption|nộp đơn xin miễn thuế
filing|ˈfaɪlɪŋ|n.|việc nộp hồ sơ|check the tax filing deadline|kiểm tra hạn nộp hồ sơ thuế
penalty|ˈpenəlti|n.|khoản phạt|avoid the late payment penalty|tránh khoản phạt chậm thanh toán
income|ˈɪnkʌm|n.|thu nhập|declare all taxable income|khai báo toàn bộ thu nhập chịu thuế
withholding|wɪðˈhoʊldɪŋ|n.|khoản thuế giữ lại|review the payroll withholding|xem lại khoản thuế giữ lại trên bảng lương
allowable|əˈlaʊəbəl|adj.|được phép|identify allowable expenses|xác định các chi phí được phép
receipt book|rɪˈsiːt bʊk|n.|sổ biên lai|keep the receipt book safely|giữ sổ biên lai an toàn
assessment notice|əˈsesmənt ˈnoʊtɪs|n.|thông báo ấn định thuế|read the assessment notice|đọc thông báo ấn định thuế
levy|ˈlevi|n.|khoản thuế, khoản thu|review the new government levy|xem lại khoản thu mới của chính phủ
taxable|ˈtæksəbəl|adj.|chịu thuế|calculate the taxable amount|tính số tiền chịu thuế
`],
['Báo cáo tài chính','Financial statements','Tài chính',`
financial|faɪˈnænʃəl|adj.|thuộc tài chính|review the financial report|xem lại báo cáo tài chính
cash flow|ˈkæʃ floʊ|n.|dòng tiền|monitor the monthly cash flow|theo dõi dòng tiền hằng tháng
balance sheet|ˈbæləns ʃiːt|n.|bảng cân đối kế toán|prepare the balance sheet|lập bảng cân đối kế toán
margin|ˈmɑːrdʒɪn|n.|biên lợi nhuận|calculate the profit margin|tính biên lợi nhuận
quarterly|ˈkwɔːrtərli|adj.|hằng quý|publish the quarterly results|công bố kết quả hằng quý
annual|ˈænjuəl|adj.|hằng năm|read the annual report|đọc báo cáo hằng năm
expenditure|ɪkˈspendɪtʃər|n.|khoản chi tiêu|reduce unnecessary expenditure|giảm chi tiêu không cần thiết
solvency|ˈsɑːlvənsi|n.|khả năng thanh toán|assess the company's solvency|đánh giá khả năng thanh toán của công ty
ratio|ˈreɪʃioʊ|n.|tỷ số|calculate the debt ratio|tính tỷ số nợ
loss|lɔːs|n.|khoản lỗ|report the operating loss|báo cáo khoản lỗ hoạt động
projection|prəˈdʒekʃən|n.|dự tính|update the revenue projection|cập nhật dự tính doanh thu
transparency|trænsˈpærənsi|n.|sự minh bạch|improve financial transparency|cải thiện sự minh bạch tài chính
`],
['Văn phòng & cơ sở','Property & facilities','Vận hành',`
premises|ˈpremɪsɪz|n.|cơ sở, khu nhà|inspect the office premises|kiểm tra cơ sở văn phòng
facility|fəˈsɪləti|n.|cơ sở vật chất|upgrade the training facility|nâng cấp cơ sở đào tạo
layout|ˈleɪaʊt|n.|cách bố trí|redesign the office layout|thiết kế lại cách bố trí văn phòng
department|dɪˈpɑːrtmənt|n.|phòng ban|contact the purchasing department|liên hệ phòng thu mua
relocate|ˌriːˈloʊkeɪt|v.|di dời|relocate the main office|di dời văn phòng chính
renovate|ˈrenəveɪt|v.|cải tạo|renovate the reception area|cải tạo khu vực lễ tân
security|sɪˈkjʊrəti|n.|an ninh|improve building security|cải thiện an ninh tòa nhà
utility|juːˈtɪləti|n.|dịch vụ điện nước|review the monthly utility costs|xem lại chi phí điện nước hằng tháng
workspace|ˈwɜːrkspeɪs|n.|không gian làm việc|organize your workspace|sắp xếp không gian làm việc
entrance|ˈentrəns|n.|lối vào|use the main entrance|sử dụng lối vào chính
ventilation|ˌventɪˈleɪʃən|n.|hệ thống thông gió|check the room ventilation|kiểm tra thông gió trong phòng
accessible|əkˈsesəbəl|adj.|dễ tiếp cận|make the building accessible|làm cho tòa nhà dễ tiếp cận
`],
['Họp hội đồng','Board meetings','Vận hành',`
board|bɔːrd|n.|hội đồng quản trị|brief the board on the results|báo cáo tóm tắt kết quả cho hội đồng quản trị
chairperson|ˈtʃerˌpɜːrsən|n.|chủ tọa|elect a new chairperson|bầu chủ tọa mới
minutes|ˈmɪnɪts|n.|biên bản cuộc họp|circulate the meeting minutes|gửi biên bản cuộc họp
motion|ˈmoʊʃən|n.|kiến nghị chính thức|support the proposed motion|ủng hộ kiến nghị được đề xuất
vote|voʊt|v.|bỏ phiếu|vote on the new policy|bỏ phiếu về chính sách mới
quorum|ˈkwɔːrəm|n.|số người tối thiểu để họp|check whether a quorum is present|kiểm tra xem đã đủ số người tối thiểu để họp chưa
resolution|ˌrezəˈluːʃən|n.|nghị quyết|adopt the final resolution|thông qua nghị quyết cuối cùng
unanimous|juˈnænɪməs|adj.|nhất trí|seek unanimous approval|tìm kiếm sự phê duyệt nhất trí
adjourn|əˈdʒɜːrn|v.|hoãn, kết thúc phiên họp|adjourn the meeting at noon|kết thúc phiên họp vào buổi trưa
deliberate|dɪˈlɪbəreɪt|v.|cân nhắc kỹ|deliberate on the proposal|cân nhắc kỹ đề xuất
stakeholder|ˈsteɪkhoʊldər|n.|bên liên quan|consult each key stakeholder|tham vấn từng bên liên quan chính
decision|dɪˈsɪʒən|n.|quyết định|record the final decision|ghi lại quyết định cuối cùng
`],
['Kiểm soát chất lượng','Quality control','Vận hành',`
quality|ˈkwɑːləti|n.|chất lượng|improve the product quality|cải thiện chất lượng sản phẩm
inspect|ɪnˈspekt|v.|kiểm tra|inspect the finished goods|kiểm tra thành phẩm
standard|ˈstændərd|n.|tiêu chuẩn|meet the required safety standard|đáp ứng tiêu chuẩn an toàn bắt buộc
sample|ˈsæmpəl|n.|mẫu|test a random sample|kiểm tra một mẫu ngẫu nhiên
compliance|kəmˈplaɪəns|n.|sự tuân thủ|verify compliance with regulations|xác minh việc tuân thủ quy định
reliable|rɪˈlaɪəbəl|adj.|đáng tin cậy|choose a reliable testing method|chọn phương pháp kiểm tra đáng tin cậy
consistent|kənˈsɪstənt|adj.|đồng đều, nhất quán|maintain consistent quality|duy trì chất lượng đồng đều
faulty|ˈfɔːlti|adj.|bị lỗi|remove the faulty component|loại bỏ linh kiện bị lỗi
tolerance|ˈtɑːlərəns|n.|dung sai|measure the manufacturing tolerance|đo dung sai sản xuất
benchmark|ˈbentʃmɑːrk|n.|mốc chuẩn|establish a quality benchmark|thiết lập mốc chuẩn chất lượng
corrective|kəˈrektɪv|adj.|mang tính khắc phục|take corrective action|thực hiện biện pháp khắc phục
assurance|əˈʃʊrəns|n.|sự bảo đảm|strengthen the quality assurance process|tăng cường quy trình bảo đảm chất lượng
`],
['Phát triển sản phẩm','Product development','Vận hành',`
prototype|ˈproʊtətaɪp|n.|nguyên mẫu|test the working prototype|thử nghiệm nguyên mẫu hoạt động được
innovation|ˌɪnəˈveɪʃən|n.|sự đổi mới|encourage product innovation|khuyến khích đổi mới sản phẩm
design|dɪˈzaɪn|n.|thiết kế|review the final design|xem lại thiết kế cuối cùng
research|ˈriːsɜːrtʃ|n.|nghiên cứu|conduct market research|thực hiện nghiên cứu thị trường
manufacture|ˌmænjuˈfæktʃər|v.|sản xuất|manufacture the components locally|sản xuất linh kiện tại địa phương
patent|ˈpætənt|n.|bằng sáng chế|apply for a product patent|nộp đơn xin bằng sáng chế sản phẩm
component|kəmˈpoʊnənt|n.|linh kiện|test each electronic component|kiểm tra từng linh kiện điện tử
refine|rɪˈfaɪn|v.|tinh chỉnh|refine the product design|tinh chỉnh thiết kế sản phẩm
trial|ˈtraɪəl|n.|đợt thử nghiệm|organize a product trial|tổ chức đợt thử nghiệm sản phẩm
usability|ˌjuːzəˈbɪləti|n.|tính dễ sử dụng|evaluate the app's usability|đánh giá tính dễ sử dụng của ứng dụng
production|prəˈdʌkʃən|n.|hoạt động sản xuất|increase the production capacity|tăng năng lực sản xuất
patentable|ˈpætəntəbəl|adj.|có thể được cấp bằng sáng chế|check whether the invention is patentable|kiểm tra xem phát minh có thể được cấp bằng sáng chế không
`],
['Thuê & cho thuê','Renting & leasing','Vận hành',`
lease|liːs|n.|hợp đồng thuê dài hạn|review the office lease|xem lại hợp đồng thuê văn phòng
tenant|ˈtenənt|n.|người thuê|contact the current tenant|liên hệ người thuê hiện tại
landlord|ˈlændlɔːrd|n.|chủ nhà|notify the landlord in writing|thông báo cho chủ nhà bằng văn bản
rent|rent|n.|tiền thuê|pay the monthly rent|trả tiền thuê hằng tháng
occupancy|ˈɑːkjəpənsi|n.|việc sử dụng mặt bằng|confirm the occupancy date|xác nhận ngày bắt đầu sử dụng mặt bằng
renewal|rɪˈnuːəl|n.|sự gia hạn|discuss the lease renewal|thảo luận việc gia hạn hợp đồng thuê
sublet|ˌsʌbˈlet|v.|cho thuê lại|sublet the unused office space|cho thuê lại diện tích văn phòng chưa dùng
furnished|ˈfɜːrnɪʃt|adj.|có sẵn nội thất|choose a furnished apartment|chọn căn hộ có sẵn nội thất
vacant|ˈveɪkənt|adj.|còn trống|inspect the vacant property|kiểm tra bất động sản còn trống
inspection|ɪnˈspekʃən|n.|cuộc kiểm tra|arrange a property inspection|sắp xếp cuộc kiểm tra bất động sản
security deposit|sɪˈkjʊrəti dɪˈpɑːzɪt|n.|tiền đặt cọc bảo đảm|request the security deposit refund|yêu cầu hoàn tiền đặt cọc bảo đảm
notice period|ˈnoʊtɪs ˈpɪriəd|n.|thời hạn báo trước|check the required notice period|kiểm tra thời hạn báo trước bắt buộc
`],
['Chọn nhà hàng','Choosing a restaurant','Ẩm thực',`
reservation|ˌrezərˈveɪʃən|n.|đặt chỗ|make a dinner reservation|đặt chỗ ăn tối
cuisine|kwɪˈziːn|n.|phong cách ẩm thực|try the local cuisine|thử ẩm thực địa phương
ambience|ˈæmbiəns|n.|bầu không khí|enjoy the relaxed ambience|tận hưởng bầu không khí thư thái
recommendation|ˌrekəmenˈdeɪʃən|n.|lời gợi ý|ask for a restaurant recommendation|xin gợi ý nhà hàng
menu|ˈmenjuː|n.|thực đơn|check the dinner menu|xem thực đơn bữa tối
location|loʊˈkeɪʃən|n.|vị trí|confirm the restaurant location|xác nhận vị trí nhà hàng
atmosphere|ˈætməsfɪr|n.|không khí, không gian|enjoy the friendly atmosphere|tận hưởng không khí thân thiện
rating|ˈreɪtɪŋ|n.|điểm đánh giá|check the restaurant's rating|kiểm tra điểm đánh giá của nhà hàng
vegetarian|ˌvedʒəˈteriən|adj.|chay|ask for a vegetarian menu|xin thực đơn chay
outdoor|ˈaʊtdɔːr|adj.|ngoài trời|book an outdoor table|đặt bàn ngoài trời
affordable|əˈfɔːrdəbəl|adj.|giá phải chăng|find an affordable restaurant|tìm nhà hàng giá phải chăng
specialty|ˈspeʃəlti|n.|món đặc trưng|try the chef's specialty|thử món đặc trưng của đầu bếp
`],
['Ăn tại nhà hàng','Dining out','Ẩm thực',`
appetizer|ˈæpɪtaɪzər|n.|món khai vị|order a light appetizer|gọi món khai vị nhẹ
entree|ˈɑːntreɪ|n.|món chính|choose an entree from the menu|chọn món chính từ thực đơn
dessert|dɪˈzɜːrt|n.|món tráng miệng|share a chocolate dessert|cùng ăn món tráng miệng sô cô la
beverage|ˈbevərɪdʒ|n.|đồ uống|choose a cold beverage|chọn đồ uống lạnh
server|ˈsɜːrvər|n.|nhân viên phục vụ|ask the server for water|nhờ nhân viên phục vụ mang nước
gratuity|ɡrəˈtuːəti|n.|tiền boa|check whether the gratuity is included|kiểm tra xem tiền boa đã được tính chưa
portion|ˈpɔːrʃən|n.|khẩu phần|order a smaller portion|gọi khẩu phần nhỏ hơn
allergy|ˈælərdʒi|n.|dị ứng|mention your food allergy|thông báo tình trạng dị ứng thực phẩm của bạn
refill|ˈriːfɪl|n.|phần rót thêm|ask for a coffee refill|xin rót thêm cà phê
utensil|juːˈtensəl|n.|dụng cụ ăn uống|use a clean utensil|sử dụng dụng cụ ăn uống sạch
check|tʃek|n.|hóa đơn nhà hàng|ask for the check|yêu cầu hóa đơn nhà hàng
complimentary|ˌkɑːmplɪˈmentəri|adj.|miễn phí kèm theo|enjoy a complimentary drink|thưởng thức đồ uống miễn phí kèm theo
`],
['Đặt bữa trưa','Ordering lunch','Ẩm thực',`
takeout|ˈteɪkaʊt|n.|đồ ăn mang đi|order takeout for the team|đặt đồ ăn mang đi cho cả nhóm
catering|ˈkeɪtərɪŋ|n.|dịch vụ cung cấp suất ăn|arrange catering for the meeting|sắp xếp dịch vụ suất ăn cho cuộc họp
order|ˈɔːrdər|n.|đơn đặt món|confirm the lunch order|xác nhận đơn đặt bữa trưa
sandwich|ˈsænwɪtʃ|n.|bánh mì kẹp|choose a chicken sandwich|chọn bánh mì kẹp gà
salad|ˈsæləd|n.|rau trộn|add a fresh salad|thêm món rau trộn tươi
pickup|ˈpɪkʌp|n.|việc đến nhận|arrange a noon pickup|sắp xếp đến nhận vào buổi trưa
napkin|ˈnæpkɪn|n.|khăn ăn|take an extra napkin|lấy thêm một chiếc khăn ăn
container|kənˈteɪnər|n.|hộp đựng|use a reusable container|dùng hộp đựng tái sử dụng
customize|ˈkʌstəmaɪz|v.|tùy chỉnh|customize your lunch order|tùy chỉnh đơn bữa trưa của bạn
condiment|ˈkɑːndɪmənt|n.|gia vị dùng kèm|choose your favorite condiment|chọn loại gia vị dùng kèm yêu thích
combo|ˈkɑːmboʊ|n.|suất kết hợp|order the lunch combo|gọi suất ăn trưa kết hợp
cutlery|ˈkʌtləri|n.|dao nĩa thìa ăn uống|request reusable cutlery|yêu cầu dao nĩa thìa tái sử dụng
`],
['Nghề bếp','Cooking careers','Ẩm thực',`
chef|ʃef|n.|đầu bếp chính|meet the head chef|gặp đầu bếp trưởng
recipe|ˈresəpi|n.|công thức nấu ăn|follow the original recipe|làm theo công thức nấu ăn gốc
ingredient|ɪnˈɡriːdiənt|n.|nguyên liệu|prepare each fresh ingredient|chuẩn bị từng nguyên liệu tươi
cuisine training|kwɪˈziːn ˈtreɪnɪŋ|n.|đào tạo ẩm thực|complete the cuisine training|hoàn thành khóa đào tạo ẩm thực
culinary|ˈkʌlɪneri|adj.|thuộc ẩm thực|develop your culinary skills|phát triển kỹ năng ẩm thực
hygiene|ˈhaɪdʒiːn|n.|vệ sinh|maintain good kitchen hygiene|duy trì vệ sinh nhà bếp tốt
apprentice|əˈprentɪs|n.|người học nghề|train the new apprentice|đào tạo người học nghề mới
pastry|ˈpeɪstri|n.|bánh ngọt nướng|prepare a fresh pastry|chuẩn bị một chiếc bánh ngọt nướng mới
season|ˈsiːzən|v.|nêm gia vị|season the soup lightly|nêm gia vị nhẹ cho súp
simmer|ˈsɪmər|v.|nấu liu riu|simmer the sauce gently|nấu nước sốt liu riu
bake|beɪk|v.|nướng bằng lò|bake the bread until golden|nướng bánh mì đến khi vàng
plating|ˈpleɪtɪŋ|n.|việc trình bày món ăn|practice elegant plating|luyện trình bày món ăn đẹp mắt
`],
['Tổ chức sự kiện','Events','Ẩm thực',`
event|ɪˈvent|n.|sự kiện|organize the company event|tổ chức sự kiện công ty
banquet|ˈbæŋkwɪt|n.|tiệc lớn|arrange the awards banquet|sắp xếp tiệc trao giải
invitation|ˌɪnvɪˈteɪʃən|n.|lời mời|send the formal invitation|gửi lời mời chính thức
guest|ɡest|n.|khách mời|welcome each arriving guest|chào đón từng khách mời đến
host|hoʊst|n.|người chủ trì|thank the event host|cảm ơn người chủ trì sự kiện
decoration|ˌdekəˈreɪʃən|n.|đồ trang trí|choose a simple decoration|chọn đồ trang trí đơn giản
capacity|kəˈpæsəti|n.|sức chứa|check the hall's capacity|kiểm tra sức chứa của hội trường
buffet|bəˈfeɪ|n.|tiệc tự chọn|prepare the lunch buffet|chuẩn bị tiệc trưa tự chọn
arrangement|əˈreɪndʒmənt|n.|sự sắp xếp|confirm the seating arrangement|xác nhận cách sắp xếp chỗ ngồi
celebration|ˌseləˈbreɪʃən|n.|buổi lễ mừng|plan the anniversary celebration|lên kế hoạch lễ kỷ niệm
coordinator|koʊˈɔːrdɪneɪtər|n.|điều phối viên|contact the event coordinator|liên hệ điều phối viên sự kiện
attendance|əˈtendəns|n.|số người tham dự|confirm the expected attendance|xác nhận số người dự kiến tham dự
`],
['Đi công tác','Business travel','Di chuyển',`
itinerary|aɪˈtɪnəreri|n.|lịch trình chuyến đi|review the travel itinerary|xem lại lịch trình chuyến đi
passport|ˈpæspɔːrt|n.|hộ chiếu|check your passport validity|kiểm tra thời hạn hộ chiếu
visa|ˈviːzə|n.|thị thực|apply for a business visa|xin thị thực công tác
luggage|ˈlʌɡɪdʒ|n.|hành lý|label your luggage clearly|ghi nhãn hành lý rõ ràng
accommodation|əˌkɑːməˈdeɪʃən|n.|chỗ ở|book suitable accommodation|đặt chỗ ở phù hợp
abroad|əˈbrɔːd|adv.|ở nước ngoài|prepare to work abroad|chuẩn bị làm việc ở nước ngoài
journey|ˈdʒɜːrni|n.|hành trình|plan the return journey|lên kế hoạch hành trình trở về
insurance|ɪnˈʃʊrəns|n.|bảo hiểm|check the travel insurance|kiểm tra bảo hiểm du lịch
embassy|ˈembəsi|n.|đại sứ quán|contact the nearest embassy|liên hệ đại sứ quán gần nhất
adapter|əˈdæptər|n.|đầu chuyển đổi|pack a universal power adapter|mang theo đầu chuyển đổi điện đa năng
reimbursement|ˌriːɪmˈbɜːrsmənt|n.|việc hoàn trả chi phí|submit a reimbursement request|nộp yêu cầu hoàn trả chi phí
time zone|ˈtaɪm zoʊn|n.|múi giờ|check the local time zone|kiểm tra múi giờ địa phương
`],
['Hàng không','Air travel','Di chuyển',`
boarding pass|ˈbɔːrdɪŋ pæs|n.|thẻ lên máy bay|download your boarding pass|tải thẻ lên máy bay
flight|flaɪt|n.|chuyến bay|confirm the return flight|xác nhận chuyến bay về
departure|dɪˈpɑːrtʃər|n.|giờ, sự khởi hành|check the departure time|kiểm tra giờ khởi hành
arrival|əˈraɪvəl|n.|giờ, sự đến nơi|confirm the arrival time|xác nhận giờ đến nơi
gate|ɡeɪt|n.|cửa ra máy bay|find the correct boarding gate|tìm đúng cửa lên máy bay
terminal|ˈtɜːrmɪnəl|n.|nhà ga sân bay|go to the international terminal|đến nhà ga quốc tế
layover|ˈleɪoʊvər|n.|thời gian chờ nối chuyến|plan for a long layover|chuẩn bị cho thời gian chờ nối chuyến dài
baggage claim|ˈbæɡɪdʒ kleɪm|n.|khu nhận hành lý|proceed to baggage claim|đi đến khu nhận hành lý
cabin|ˈkæbɪn|n.|khoang máy bay|keep the cabin aisle clear|giữ lối đi trong khoang máy bay thông thoáng
fare|fer|n.|giá vé|compare the available air fare options|so sánh các lựa chọn giá vé máy bay hiện có
check-in|ˈtʃek ɪn|n.|việc làm thủ tục|complete online check-in|hoàn tất thủ tục trực tuyến
cancellation|ˌkænsəˈleɪʃən|n.|sự hủy bỏ|check the flight cancellation policy|kiểm tra chính sách hủy chuyến bay
`],
['Tàu hỏa','Rail travel','Di chuyển',`
platform|ˈplætfɔːrm|n.|sân ga|wait on the correct platform|chờ ở đúng sân ga
timetable|ˈtaɪmteɪbəl|n.|bảng giờ tàu|check the updated timetable|kiểm tra bảng giờ tàu đã cập nhật
carriage|ˈkærɪdʒ|n.|toa tàu|find your assigned carriage|tìm toa tàu được chỉ định
commuter|kəˈmjuːtər|n.|người đi làm hằng ngày|ask a regular commuter for directions|hỏi người đi làm thường xuyên chỉ đường
railway|ˈreɪlweɪ|n.|đường sắt|check the railway service updates|kiểm tra thông tin cập nhật dịch vụ đường sắt
round trip|ˌraʊnd ˈtrɪp|n.|chuyến khứ hồi|book a round trip to the city|đặt chuyến khứ hồi đến thành phố
conductor|kənˈdʌktər|n.|nhân viên soát vé tàu|show your ticket to the conductor|xuất trình vé cho nhân viên soát vé tàu
delay|dɪˈleɪ|n.|sự chậm trễ|check the reason for the delay|kiểm tra lý do chậm trễ
express|ɪkˈspres|adj.|chạy nhanh, ít dừng|take the express train|đi tàu tốc hành
rail pass|ˈreɪl pæs|n.|vé tàu nhiều lượt|buy a monthly rail pass|mua vé tàu tháng
transfer station|ˈtrænsfɜːr ˈsteɪʃən|n.|ga chuyển tuyến|meet at the transfer station|gặp ở ga chuyển tuyến
reserved|rɪˈzɜːrvd|adj.|được đặt trước|find your reserved seat|tìm chỗ ngồi đã đặt trước
`],
['Khách sạn','Hotels','Di chuyển',`
check-out|ˈtʃek aʊt|n.|việc trả phòng|confirm the check-out time|xác nhận giờ trả phòng
concierge|kɑːnˈsjerʒ|n.|nhân viên hỗ trợ khách|ask the concierge for directions|nhờ nhân viên hỗ trợ khách chỉ đường
suite|swiːt|n.|phòng cao cấp nhiều gian|book a business suite|đặt phòng cao cấp dành cho công tác
amenity|əˈmenəti|n.|tiện nghi|check each advertised amenity|kiểm tra từng tiện nghi được quảng cáo
housekeeping|ˈhaʊskiːpɪŋ|n.|dịch vụ buồng phòng|contact housekeeping for fresh towels|liên hệ dịch vụ buồng phòng để lấy khăn sạch
occupant|ˈɑːkjəpənt|n.|người ở trong phòng|confirm the number of occupants|xác nhận số người ở trong phòng
vacancy sign|ˈveɪkənsi saɪn|n.|biển báo còn phòng|look for the vacancy sign|tìm biển báo còn phòng
lobby|ˈlɑːbi|n.|sảnh|wait in the hotel lobby|chờ ở sảnh khách sạn
room service|ˈruːm ˌsɜːrvɪs|n.|dịch vụ phục vụ tại phòng|order breakfast through room service|đặt bữa sáng qua dịch vụ tại phòng
single room|ˈsɪŋɡəl ruːm|n.|phòng đơn|reserve a single room|đặt phòng đơn
wake-up call|ˈweɪk ʌp kɔːl|n.|cuộc gọi báo thức|request an early wake-up call|yêu cầu cuộc gọi báo thức sớm
hospitality|ˌhɑːspɪˈtæləti|n.|sự hiếu khách|appreciate the staff's hospitality|trân trọng sự hiếu khách của nhân viên
`],
['Thuê xe','Car rentals','Di chuyển',`
rental|ˈrentəl|n.|dịch vụ cho thuê|compare the rental rates|so sánh giá thuê
license|ˈlaɪsəns|n.|giấy phép|show your driver's license|xuất trình bằng lái xe
mileage|ˈmaɪlɪdʒ|n.|số dặm đã đi|record the starting mileage|ghi số dặm ban đầu
fuel|ˈfjuːəl|n.|nhiên liệu|check the fuel level|kiểm tra mức nhiên liệu
vehicle|ˈviːəkəl|n.|phương tiện|inspect the rental vehicle|kiểm tra xe thuê
collision|kəˈlɪʒən|n.|va chạm|review the collision coverage|xem phạm vi bảo hiểm va chạm
insurance excess|ɪnˈʃʊrəns ˈekses|n.|mức tự chịu bảo hiểm|check the insurance excess|kiểm tra mức tự chịu bảo hiểm
automatic|ˌɔːtəˈmætɪk|adj.|tự động|request an automatic car|yêu cầu xe số tự động
pickup point|ˈpɪkʌp pɔɪnt|n.|điểm nhận xe|confirm the pickup point|xác nhận điểm nhận xe
return location|rɪˈtɜːrn loʊˈkeɪʃən|n.|địa điểm trả xe|check the return location|kiểm tra địa điểm trả xe
navigation|ˌnævɪˈɡeɪʃən|n.|hệ thống dẫn đường|test the navigation system|kiểm tra hệ thống dẫn đường
roadside assistance|ˈroʊdsaɪd əˈsɪstəns|n.|hỗ trợ bên đường|save the roadside assistance number|lưu số điện thoại hỗ trợ bên đường
`],
['Điện ảnh','Movies','Văn hóa',`
screening|ˈskriːnɪŋ|n.|suất chiếu phim|book the evening screening|đặt suất chiếu buổi tối
subtitle|ˈsʌbtaɪtəl|n.|phụ đề|check the subtitle language|kiểm tra ngôn ngữ phụ đề
director|dəˈrektər|n.|đạo diễn|read an interview with the director|đọc bài phỏng vấn đạo diễn
cast|kæst|n.|dàn diễn viên|learn about the film's cast|tìm hiểu dàn diễn viên của bộ phim
review|rɪˈvjuː|n.|bài đánh giá|read a recent movie review|đọc bài đánh giá phim gần đây
premiere|prɪˈmɪr|n.|buổi công chiếu đầu tiên|attend the film premiere|tham dự buổi công chiếu phim đầu tiên
plot|plɑːt|n.|cốt truyện|discuss the film's plot|thảo luận cốt truyện của phim
box office|ˈbɑːks ˌɔːfɪs|n.|quầy bán vé|collect the tickets at the box office|nhận vé tại quầy bán vé
trailer|ˈtreɪlər|n.|đoạn giới thiệu phim|watch the official trailer|xem đoạn giới thiệu phim chính thức
documentary|ˌdɑːkjəˈmentəri|n.|phim tài liệu|choose an educational documentary|chọn phim tài liệu giáo dục
cinema|ˈsɪnəmə|n.|rạp chiếu phim|find the nearest cinema|tìm rạp chiếu phim gần nhất
sequel|ˈsiːkwəl|n.|phần phim tiếp theo|watch the long-awaited sequel|xem phần phim tiếp theo được mong đợi từ lâu
`],
['Sân khấu','Theater','Văn hóa',`
stage|steɪdʒ|n.|sân khấu|prepare the stage for rehearsal|chuẩn bị sân khấu cho buổi tập
rehearsal|rɪˈhɜːrsəl|n.|buổi tập dượt|attend the final rehearsal|tham dự buổi tập dượt cuối cùng
intermission|ˌɪntərˈmɪʃən|n.|giờ nghỉ giữa buổi|return after the intermission|trở lại sau giờ nghỉ giữa buổi
balcony|ˈbælkəni|n.|khu ghế ban công|reserve seats in the balcony|đặt ghế ở khu ban công
usher|ˈʌʃər|n.|nhân viên hướng dẫn chỗ ngồi|ask the usher for assistance|nhờ nhân viên hướng dẫn chỗ ngồi hỗ trợ
script|skrɪpt|n.|kịch bản|read the revised script|đọc kịch bản đã chỉnh sửa
playwright|ˈpleɪraɪt|n.|nhà viết kịch|meet the local playwright|gặp nhà viết kịch địa phương
curtain|ˈkɜːrtən|n.|màn sân khấu|check the stage curtain|kiểm tra màn sân khấu
applause|əˈplɔːz|n.|tiếng vỗ tay|join the audience's applause|cùng khán giả vỗ tay
costume|ˈkɑːstuːm|n.|trang phục biểu diễn|prepare the actor's costume|chuẩn bị trang phục của diễn viên
matinee|ˌmætɪˈneɪ|n.|suất diễn ban ngày|book tickets for the matinee|đặt vé suất diễn ban ngày
backstage|ˌbækˈsteɪdʒ|adv.|ở hậu trường|wait backstage before the show|chờ ở hậu trường trước buổi diễn
`],
['Âm nhạc','Music','Văn hóa',`
concert|ˈkɑːnsərt|n.|buổi hòa nhạc|attend the outdoor concert|tham dự buổi hòa nhạc ngoài trời
orchestra|ˈɔːrkɪstrə|n.|dàn nhạc giao hưởng|listen to the visiting orchestra|nghe dàn nhạc giao hưởng đến biểu diễn
musician|mjuˈzɪʃən|n.|nhạc sĩ, nhạc công|interview a local musician|phỏng vấn nhạc sĩ địa phương
instrument|ˈɪnstrəmənt|n.|nhạc cụ|learn to play a new instrument|học chơi nhạc cụ mới
melody|ˈmelədi|n.|giai điệu|practice the opening melody|tập giai điệu mở đầu
composer|kəmˈpoʊzər|n.|nhà soạn nhạc|read about the composer|đọc về nhà soạn nhạc
choir|ˈkwaɪər|n.|dàn hợp xướng|join the community choir|tham gia dàn hợp xướng cộng đồng
recital|rɪˈsaɪtəl|n.|buổi độc tấu|reserve a seat for the piano recital|đặt chỗ cho buổi độc tấu piano
rhythm|ˈrɪðəm|n.|nhịp điệu|follow the rhythm carefully|theo nhịp điệu cẩn thận
album|ˈælbəm|n.|tuyển tập nhạc|listen to the new album|nghe tuyển tập nhạc mới
acoustic|əˈkuːstɪk|adj.|mộc, không dùng điện|enjoy an acoustic performance|thưởng thức tiết mục biểu diễn mộc
repertoire|ˈrepərtwɑːr|n.|vốn tiết mục biểu diễn|expand the band's repertoire|mở rộng vốn tiết mục của ban nhạc
`],
['Bảo tàng','Museums','Văn hóa',`
exhibition|ˌeksɪˈbɪʃən|n.|triển lãm|visit the temporary exhibition|tham quan triển lãm tạm thời
artifact|ˈɑːrtɪfækt|n.|hiện vật|examine the ancient artifact|quan sát hiện vật cổ
curator|kjʊˈreɪtər|n.|người phụ trách bảo tàng|speak with the museum curator|trao đổi với người phụ trách bảo tàng
admission|ədˈmɪʃən|n.|quyền, phí vào cửa|check the admission fee|kiểm tra phí vào cửa
gallery|ˈɡæləri|n.|phòng trưng bày|explore the modern art gallery|tham quan phòng trưng bày nghệ thuật hiện đại
collection|kəˈlekʃən|n.|bộ sưu tập|view the permanent collection|xem bộ sưu tập thường trực
guide|ɡaɪd|n.|hướng dẫn viên|follow the museum guide|đi theo hướng dẫn viên bảo tàng
preserve|prɪˈzɜːrv|v.|bảo tồn|preserve the historic building|bảo tồn tòa nhà lịch sử
sculpture|ˈskʌlptʃər|n.|tác phẩm điêu khắc|photograph the outdoor sculpture|chụp ảnh tác phẩm điêu khắc ngoài trời
heritage|ˈherɪtɪdʒ|n.|di sản|learn about the cultural heritage|tìm hiểu di sản văn hóa
restoration|ˌrestəˈreɪʃən|n.|sự phục chế|support the painting restoration|hỗ trợ việc phục chế tranh
interactive|ˌɪntərˈæktɪv|adj.|có tính tương tác|try the interactive exhibit|trải nghiệm khu trưng bày tương tác
`],
['Truyền thông','Media','Văn hóa',`
broadcast|ˈbrɔːdkæst|n.|chương trình phát sóng|watch the live broadcast|xem chương trình phát sóng trực tiếp
headline|ˈhedlaɪn|n.|tiêu đề tin|write a clear headline|viết tiêu đề tin rõ ràng
journalist|ˈdʒɜːrnəlɪst|n.|nhà báo|contact the business journalist|liên hệ nhà báo kinh tế
editor|ˈedɪtər|n.|biên tập viên|send the draft to the editor|gửi bản nháp cho biên tập viên
publication|ˌpʌblɪˈkeɪʃən|n.|ấn phẩm|read the industry publication|đọc ấn phẩm chuyên ngành
subscription|səbˈskrɪpʃən|n.|gói đăng ký định kỳ|renew the magazine subscription|gia hạn gói đăng ký tạp chí
press release|ˈpres rɪˌliːs|n.|thông cáo báo chí|prepare the press release|chuẩn bị thông cáo báo chí
circulation|ˌsɜːrkjəˈleɪʃən|n.|lượng phát hành|check the newspaper's circulation|kiểm tra lượng phát hành báo
article|ˈɑːrtɪkəl|n.|bài viết|proofread the feature article|soát lỗi bài viết chuyên đề
source|sɔːrs|n.|nguồn tin|verify the original source|xác minh nguồn tin gốc
editorial|ˌedɪˈtɔːriəl|n.|bài xã luận|read the newspaper editorial|đọc bài xã luận trên báo
advertising|ˈædvərtaɪzɪŋ|n.|hoạt động quảng cáo|review the advertising budget|xem lại ngân sách quảng cáo
`],
['Khám bệnh','Doctor visits','Sức khỏe',`
appointment|əˈpɔɪntmənt|n.|cuộc hẹn|confirm the medical appointment|xác nhận lịch hẹn khám bệnh
physician|fɪˈzɪʃən|n.|bác sĩ|consult a qualified physician|tham khảo bác sĩ có chuyên môn
symptom|ˈsɪmptəm|n.|triệu chứng|describe each symptom clearly|mô tả rõ từng triệu chứng
diagnosis|ˌdaɪəɡˈnoʊsɪs|n.|chẩn đoán|ask the doctor about the diagnosis|hỏi bác sĩ về chẩn đoán
examination|ɪɡˌzæmɪˈneɪʃən|n.|buổi khám|schedule a routine examination|đặt lịch khám định kỳ
referral|rɪˈfɜːrəl|n.|giấy chuyển khám|request a specialist referral|xin giấy chuyển khám chuyên khoa
patient|ˈpeɪʃənt|n.|bệnh nhân|register the new patient|đăng ký bệnh nhân mới
clinic|ˈklɪnɪk|n.|phòng khám|find the clinic address|tìm địa chỉ phòng khám
consultation|ˌkɑːnsəlˈteɪʃən|n.|buổi tư vấn chuyên môn|book an initial consultation|đặt buổi tư vấn ban đầu
medical history|ˈmedɪkəl ˈhɪstəri|n.|bệnh sử|update your medical history|cập nhật bệnh sử của bạn
specialist|ˈspeʃəlɪst|n.|bác sĩ chuyên khoa|arrange a visit to the specialist|sắp xếp buổi khám bác sĩ chuyên khoa
waiting room|ˈweɪtɪŋ ruːm|n.|phòng chờ|take a seat in the waiting room|ngồi chờ trong phòng chờ
`],
['Nha khoa','Dental visits','Sức khỏe',`
dentist|ˈdentɪst|n.|nha sĩ|make an appointment with the dentist|đặt lịch hẹn với nha sĩ
checkup|ˈtʃekʌp|n.|buổi kiểm tra sức khỏe|schedule a dental checkup|đặt lịch kiểm tra răng miệng
cavity|ˈkævəti|n.|lỗ sâu răng|ask the dentist about the cavity|hỏi nha sĩ về lỗ sâu răng
filling|ˈfɪlɪŋ|n.|miếng trám răng|check the existing filling|kiểm tra miếng trám răng hiện có
hygienist|haɪˈdʒiːnɪst|n.|chuyên viên vệ sinh răng miệng|meet the dental hygienist|gặp chuyên viên vệ sinh răng miệng
x-ray|ˈeks reɪ|n.|phim X-quang|bring your dental x-ray|mang theo phim X-quang răng
extraction|ɪkˈstrækʃən|n.|việc nhổ răng|ask about the extraction procedure|hỏi về quy trình nhổ răng
gum|ɡʌm|n.|nướu răng|report any gum discomfort|thông báo tình trạng khó chịu ở nướu
crown|kraʊn|n.|mão răng|discuss the dental crown options|thảo luận các lựa chọn mão răng
orthodontist|ˌɔːrθəˈdɑːntɪst|n.|bác sĩ chỉnh nha|consult an orthodontist|tham khảo bác sĩ chỉnh nha
dental record|ˈdentəl ˈrekərd|n.|hồ sơ nha khoa|request your dental record|yêu cầu hồ sơ nha khoa của bạn
oral|ˈɔːrəl|adj.|thuộc răng miệng|discuss your oral health|thảo luận về sức khỏe răng miệng
`],
['Bảo hiểm sức khỏe','Health insurance','Sức khỏe',`
premium|ˈpriːmiəm|n.|phí bảo hiểm|check the monthly premium|kiểm tra phí bảo hiểm hằng tháng
claim|kleɪm|n.|yêu cầu bồi thường|submit the insurance claim|nộp yêu cầu bồi thường bảo hiểm
deductible|dɪˈdʌktəbəl|n.|mức khấu trừ bảo hiểm|review the annual deductible|xem mức khấu trừ bảo hiểm hằng năm
provider|prəˈvaɪdər|n.|đơn vị cung cấp dịch vụ|contact your insurance provider|liên hệ đơn vị cung cấp bảo hiểm
beneficiary|ˌbenɪˈfɪʃieri|n.|người thụ hưởng|update the beneficiary information|cập nhật thông tin người thụ hưởng
copayment|ˈkoʊpeɪmənt|n.|khoản đồng chi trả cố định|check the consultation copayment|kiểm tra khoản đồng chi trả cho buổi khám
enrollment|ɪnˈroʊlmənt|n.|việc ghi danh|complete the insurance enrollment|hoàn thành đăng ký bảo hiểm
exclusion|ɪkˈskluːʒən|n.|điều khoản loại trừ|read each policy exclusion|đọc từng điều khoản loại trừ của hợp đồng
insurer|ɪnˈʃʊrər|n.|công ty bảo hiểm|request confirmation from the insurer|yêu cầu xác nhận từ công ty bảo hiểm
preauthorization|ˌpriːɔːθərəˈzeɪʃən|n.|sự chấp thuận trước|check the preauthorization requirements|kiểm tra yêu cầu chấp thuận trước
insured|ɪnˈʃʊrd|adj.|được bảo hiểm|confirm the insured person's details|xác nhận thông tin người được bảo hiểm
out-of-pocket|ˌaʊt əv ˈpɑːkɪt|adj.|tự chi trả|estimate the out-of-pocket cost|ước tính chi phí tự chi trả
`],
['Bệnh viện','Hospitals','Sức khỏe',`
emergency|ɪˈmɜːrdʒənsi|n.|tình huống khẩn cấp|locate the emergency department|tìm khoa cấp cứu
ward|wɔːrd|n.|khu điều trị|find the correct hospital ward|tìm đúng khu điều trị của bệnh viện
nurse|nɜːrs|n.|điều dưỡng|speak to the duty nurse|trao đổi với điều dưỡng trực
surgery|ˈsɜːrdʒəri|n.|ca phẫu thuật|confirm the surgery schedule|xác nhận lịch phẫu thuật
discharge|ˈdɪstʃɑːrdʒ|n.|việc xuất viện|collect the discharge documents|nhận giấy tờ xuất viện
treatment|ˈtriːtmənt|n.|việc điều trị|discuss the treatment plan|thảo luận kế hoạch điều trị
admission form|ədˈmɪʃən fɔːrm|n.|phiếu nhập viện|complete the admission form|điền đầy đủ phiếu nhập viện
recovery|rɪˈkʌvəri|n.|sự hồi phục|ask about the recovery period|hỏi về thời gian hồi phục
laboratory|ˈlæbrətɔːri|n.|phòng xét nghiệm|find the hospital laboratory|tìm phòng xét nghiệm của bệnh viện
outpatient|ˈaʊtpeɪʃənt|n.|bệnh nhân ngoại trú|register as an outpatient|đăng ký khám ngoại trú
inpatient|ˈɪnpeɪʃənt|n.|bệnh nhân nội trú|check the inpatient visiting hours|kiểm tra giờ thăm bệnh nhân nội trú
visiting hours|ˈvɪzɪtɪŋ ˈaʊərz|n.|giờ thăm bệnh|confirm the visiting hours|xác nhận giờ thăm bệnh
`],
['Nhà thuốc','Pharmacies','Sức khỏe',`
pharmacy|ˈfɑːrməsi|n.|nhà thuốc|find a nearby pharmacy|tìm nhà thuốc gần đây
prescription|prɪˈskrɪpʃən|n.|đơn thuốc|bring the doctor's prescription|mang theo đơn thuốc của bác sĩ
pharmacist|ˈfɑːrməsɪst|n.|dược sĩ|ask the pharmacist a question|hỏi dược sĩ một câu hỏi
dosage|ˈdoʊsɪdʒ|n.|liều lượng|ask the pharmacist about the dosage|hỏi dược sĩ về liều lượng
medication|ˌmedɪˈkeɪʃən|n.|thuốc|check the medication label|kiểm tra nhãn thuốc
label|ˈleɪbəl|n.|nhãn|read the warning label|đọc nhãn cảnh báo
side effect|ˈsaɪd ɪˌfekt|n.|tác dụng phụ|ask about a possible side effect|hỏi về tác dụng phụ có thể xảy ra
expiration date|ˌekspəˈreɪʃən deɪt|n.|ngày hết hạn|check the expiration date|kiểm tra ngày hết hạn
over-the-counter|ˌoʊvər ðə ˈkaʊntər|adj.|không cần kê đơn|ask about over-the-counter products|hỏi về sản phẩm không cần kê đơn
tablet|ˈtæblət|n.|viên nén|ask whether the medicine comes as a tablet|hỏi xem thuốc có dạng viên nén không
capsule|ˈkæpsəl|n.|viên nang|check the capsule packaging|kiểm tra bao bì viên nang
refill request|ˈriːfɪl rɪˈkwest|n.|yêu cầu cấp lại thuốc|submit a prescription refill request|nộp yêu cầu cấp lại thuốc theo đơn
`]
];
const sentencePatterns = [
  [p => `Please ${p}.`, p => `Vui lòng ${p}.`],
  [p => `We need to ${p}.`, p => `Chúng ta cần ${p}.`],
  [p => `You should ${p}.`, p => `Bạn nên ${p}.`],
  [p => `Let's ${p}.`, p => `Chúng ta hãy ${p}.`]
];
const LESSONS = COURSE_SEED.map((topic, index) => ({id:index+1,title:topic[0],english:topic[1],group:topic[2],words:topic[3].trim().split('\n').map((line,i)=>{
  const [word,ipa,pos,meaning,phrase,viPhrase] = line.split('|');
  const pattern = sentencePatterns[(index+i)%sentencePatterns.length];
  return {id:`${index+1}-${i}`,lesson:index+1,word,ipa:`/${ipa}/`,pos,meaning,example:pattern[0](phrase),translation:pattern[1](viPhrase)};
})}));
const WORDS = LESSONS.flatMap(l => l.words);
