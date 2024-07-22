// •Lớp Person: bao gôm các thuộc tính họ tên, địa chỉ, mã, email
class Person {
  constructor(name, address, id, email) {
    this.name = name; // Tên
    this.address = address; // Địa chỉ
    this.id = id; // Mã id
    this.email = email; // Email
  }
}

// Lớp SinhVien kế thừa từ lớp Person
class SinhVien extends Person {
  constructor(name, address, id, email, math, physics, chemistry) {
    super(name, address, id, email); // Gọi hàm của lớp cha (Person)
    this.math = math; // Điểm môn Toán
    this.physics = physics; // Điểm môn Lý
    this.chemistry = chemistry; // Điểm môn Hóa
  }

  getAverageScore() {
    return (this.math + this.physics + this.chemistry) / 3; // Tính điểm trung bình
  }
}

// Lớp NhanVien kế thừa từ lớp Person
class NhanVien extends Person {
  constructor(name, address, id, email, workingDays, dailyWage) {
    super(name, address, id, email); // Gọi hàm của lớp cha (Person)
    this.workingDays = workingDays; // Số ngày làm việc
    this.dailyWage = dailyWage; // Lương theo ngày
  }

  getSalary() {
    return this.workingDays * this.dailyWage; // Tính lương
  }
}

// Lớp KhachHang kế thừa từ lớp Person
class KhachHang extends Person {
  constructor(name, address, id, email, companyName, billValue, rating) {
    super(name, address, id, email); // Gọi hàm của lớp cha (Person)
    this.companyName = companyName; // Tên công ty
    this.billValue = billValue; // Giá trị hóa đơn
    this.rating = rating; // Đánh giá
  }
}

// Lớp ListPerson để quản lý các đối tượng
class ListPerson {
  constructor() {
    this.personList =
      JSON.parse(localStorage.getItem("personList"))?.map((personData) => {
        switch (personData.type) {
          case "SinhVien":
            return new SinhVien(
              personData.name,
              personData.address,
              personData.id,
              personData.email,
              personData.math,
              personData.physics,
              personData.chemistry
            );
          case "NhanVien":
            return new NhanVien(
              personData.name,
              personData.address,
              personData.id,
              personData.email,
              personData.workingDays,
              personData.dailyWage
            );
          case "KhachHang":
            return new KhachHang(
              personData.name,
              personData.address,
              personData.id,
              personData.email,
              personData.companyName,
              personData.billValue,
              personData.rating
            );
          default:
            return new Person(
              personData.name,
              personData.address,
              personData.id,
              personData.email
            );
        }
      }) || []; // Lấy danh sách từ localStorage
  }

  addPerson(person) {
    if (this.personList.some((p) => p.id === person.id)) {
      alert("Mã ID đã tồn tại, vui lòng chọn số khác!");
      return false;
    }
    this.personList.push(person);
    this.saveToLocalStorage(); // Lưu vào localStorage
    return true;
  }

  removePerson(id) {
    this.personList = this.personList.filter((person) => person.id !== id);
    this.saveToLocalStorage(); // Lưu vào localStorage
  }

  updatePerson(updatedPerson) {
    const index = this.personList.findIndex(
      (person) => person.id === updatedPerson.id
    );
    if (index !== -1) {
      this.personList[index] = updatedPerson;
      this.saveToLocalStorage(); // Lưu vào localStorage
    }
  }

  sortPersonsAsc() {
    this.personList.sort((a, b) => a.name.localeCompare(b.name));
  }

  sortPersonsDesc() {
    this.personList.sort((a, b) => b.name.localeCompare(a.name));
  }

  saveToLocalStorage() {
    const personListData = this.personList.map((person) => {
      let personData = { ...person };
      personData.type = person.constructor.name;
      return personData;
    });
    localStorage.setItem("personList", JSON.stringify(personListData));
  }
}

// Khởi tạo đối tượng ListPerson
const listPerson = new ListPerson();

// Hàm xử lý khi gửi form
document
  .getElementById("personForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const address = document.getElementById("address").value;
    const id = document.getElementById("id").value;
    const email = document.getElementById("email").value;
    const type = document.getElementById("type").value;

    let person;
    if (type === "SinhVien") {
      const math = parseFloat(document.getElementById("math").value);
      const physics = parseFloat(document.getElementById("physics").value);
      const chemistry = parseFloat(document.getElementById("chemistry").value);
      person = new SinhVien(name, address, id, email, math, physics, chemistry);
    } else if (type === "NhanVien") {
      const workingDays = parseInt(
        document.getElementById("workingDays").value
      );
      const dailyWage = parseFloat(document.getElementById("dailyWage").value);
      person = new NhanVien(name, address, id, email, workingDays, dailyWage);
    } else if (type === "KhachHang") {
      const companyName = document.getElementById("companyName").value;
      const billValue = parseFloat(document.getElementById("billValue").value);
      const rating = document.getElementById("rating").value;
      person = new KhachHang(
        name,
        address,
        id,
        email,
        companyName,
        billValue,
        rating
      );
    }

    if (listPerson.addPerson(person)) {
      renderPersonList();
      this.reset();
    }
  });

// Hàm hiển thị danh sách người dùng
function renderPersonList() {
  const personList = document.getElementById("personList");
  personList.innerHTML = "";

  listPerson.personList.forEach((person) => {
    const row = document.createElement("tr");
    let calculationResult = "";

    if (person instanceof SinhVien) {
      calculationResult = person.getAverageScore().toFixed(1); // Tính điểm trung bình
    } else if (person instanceof NhanVien) {
      calculationResult = person
        .getSalary()
        .toLocaleString("vi", { style: "currency", currency: "VND" }); // Tính lương
    } else {
      calculationResult = "N/A"; // Không có tính toán cho các loại khác
    }

    row.innerHTML = `
        <td>${person.name}</td>
        <td>${person.address}</td>
        <td>${person.id}</td>
        <td>${person.email}</td>
        <td>${person.constructor.name}</td>
        <td>${calculationResult}</td>
        <td>
          <button class="btn btn-danger btn-sm" onclick="removePerson('${person.id}')">Delete</button>
          <button class="btn btn-primary btn-sm" onclick="editPerson('${person.id}')">Edit</button>
        </td>
      `;
    personList.appendChild(row);
  });
}

// Hàm điền thông tin người dùng vào form để cập nhật
function editPerson(id) {
  const person = listPerson.personList.find((person) => person.id === id);
  if (!person) return;

  document.getElementById("name").value = person.name;
  document.getElementById("address").value = person.address;
  document.getElementById("id").value = person.id;
  document.getElementById("email").value = person.email;
  document.getElementById("type").value = person.constructor.name;
  document.getElementById("id").disabled = true;

  const additionalFields = document.getElementById("additionalFields");
  additionalFields.innerHTML = "";

  if (person instanceof SinhVien) {
    additionalFields.innerHTML = `
        <div class="mb-3">
          <label for="math" class="form-label">Điểm môn toán</label>
          <input type="number" class="form-control" id="math" value="${person.math}" required>
        </div>
        <div class="mb-3">
          <label for="physics" class="form-label">Điểm môn lý</label>
          <input type="number" class="form-control" id="physics" value="${person.physics}" required>
        </div>
        <div class="mb-3">
          <label for="chemistry" class="form-label">Điểm môn hóa</label>
          <input type="number" class="form-control" id="chemistry" value="${person.chemistry}" required>
        </div>
      `;
  } else if (person instanceof NhanVien) {
    additionalFields.innerHTML = `
        <div class="mb-3">
          <label for="workingDays" class="form-label">Số ngày làm việc</label>
          <input type="number" class="form-control" id="workingDays" value="${person.workingDays}" required>
        </div>
        <div class="mb-3">
          <label for="dailyWage" class="form-label">Lương theo ngày</label>
          <input type="number" class="form-control" id="dailyWage" value="${person.dailyWage}" required>
        </div>
      `;
  } else if (person instanceof KhachHang) {
    additionalFields.innerHTML = `
        <div class="mb-3">
          <label for="companyName" class="form-label">Tên doanh nghiệp</label>
          <input type="text" class="form-control" id="companyName" value="${person.companyName}" required>
        </div>
        <div class="mb-3">
          <label for="billValue" class="form-label">Giá trị hóa đơn</label>
          <input type="number" class="form-control" id="billValue" value="${person.billValue}" required>
        </div>
        <div class="mb-3">
          <label for="rating" class="form-label">Đánh giá</label>
          <input type="text" class="form-control" id="rating" value="${person.rating}" required>
        </div>
      `;
  }

  document.getElementById("submitButton").style.display = "none";
  document.getElementById("updateButton").style.display = "block";
}

// Hàm cập nhật thông tin người dùng
document
  .getElementById("updateButton")
  .addEventListener("click", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const address = document.getElementById("address").value;
    const id = document.getElementById("id").value;
    const email = document.getElementById("email").value;
    const type = document.getElementById("type").value;

    let updatedPerson;
    if (type === "SinhVien") {
      const math = parseFloat(document.getElementById("math").value);
      const physics = parseFloat(document.getElementById("physics").value);
      const chemistry = parseFloat(document.getElementById("chemistry").value);
      updatedPerson = new SinhVien(
        name,
        address,
        id,
        email,
        math,
        physics,
        chemistry
      );
    } else if (type === "NhanVien") {
      const workingDays = parseInt(
        document.getElementById("workingDays").value
      );
      const dailyWage = parseFloat(document.getElementById("dailyWage").value);
      updatedPerson = new NhanVien(
        name,
        address,
        id,
        email,
        workingDays,
        dailyWage
      );
    } else if (type === "KhachHang") {
      const companyName = document.getElementById("companyName").value;
      const billValue = parseFloat(document.getElementById("billValue").value);
      const rating = document.getElementById("rating").value;
      updatedPerson = new KhachHang(
        name,
        address,
        id,
        email,
        companyName,
        billValue,
        rating
      );
    }

    listPerson.updatePerson(updatedPerson);
    renderPersonList();
    document.getElementById("personForm").reset();
    document.getElementById("id").disabled = false;
    document.getElementById("submitButton").style.display = "block";
    document.getElementById("updateButton").style.display = "none";
  });

// render lại danh sách khi tải trang
renderPersonList();

// Hàm xóa người dùng theo ID
function removePerson(id) {
  listPerson.removePerson(id);
  renderPersonList();
}

// Hàm thay đổi các trường nhập liệu bổ sung tùy theo loại người dùng
document.getElementById("type").addEventListener("change", function () {
  const type = this.value;
  const additionalFields = document.getElementById("additionalFields");
  additionalFields.innerHTML = "";

  if (type === "SinhVien") {
    additionalFields.innerHTML = `
            <div class="mb-3">
                <label for="math" class="form-label">Điểm môn toán</label>
                <input type="number" class="form-control" id="math" required>
            </div>
            <div class="mb-3">
                <label for="physics" class="form-label">Điểm môn lý</label>
                <input type="number" class="form-control" id="physics" required>
            </div>
            <div class="mb-3">
                <label for="chemistry" class="form-label">Điểm môn hóa</label>
                <input type="number" class="form-control" id="chemistry" required>
            </div>
        `;
  } else if (type === "NhanVien") {
    additionalFields.innerHTML = `
            <div class="mb-3">
                <label for="workingDays" class="form-label">Số ngày làm việc</label>
                <input type="number" class="form-control" id="workingDays" required>
            </div>
            <div class="mb-3">
                <label for="dailyWage" class="form-label">Lương theo ngày</label>
                <input type="number" class="form-control" id="dailyWage" required>
            </div>
        `;
  } else if (type === "KhachHang") {
    additionalFields.innerHTML = `
            <div class="mb-3">
                <label for="companyName" class="form-label">Tên doanh nghiệp</label>
                <input type="text" class="form-control" id="companyName" required>
            </div>
            <div class="mb-3">
                <label for="billValue" class="form-label">Giá trị hóa đơn</label>
                <input type="number" class="form-control" id="billValue" required>
            </div>
            <div class="mb-3">
                <label for="rating" class="form-label">Đánh giá</label>
                <input type="text" class="form-control" id="rating" required>
            </div>
        `;
  }
});

// Hàm tạo chức năng sắp xếp theo tên
let isAsc = true;

document.getElementById("sortIcon").addEventListener("click", function () {
  if (isAsc) {
    listPerson.sortPersonsAsc();
    this.classList.remove("fa-arrow-down");
    this.classList.add("fa-arrow-up");
  } else {
    listPerson.sortPersonsDesc();
    this.classList.remove("fa-arrow-up");
    this.classList.add("fa-arrow-down");
  }
  isAsc = !isAsc;
  renderPersonList();
});

// Hàm lọc danh sách người dùng
function filterPersonList(type) {
  const personList = document.getElementById("personList");
  personList.innerHTML = "";

  listPerson.personList.forEach((person) => {
    if (
      (type === "SinhVien" && person instanceof SinhVien) ||
      (type === "NhanVien" && person instanceof NhanVien) ||
      (type === "KhachHang" && person instanceof KhachHang) ||
      type === "All"
    ) {
      const row = document.createElement("tr");
      let calculationResult = "";

      if (person instanceof SinhVien) {
        calculationResult = person.getAverageScore().toFixed(1); // Tính điểm trung bình
      } else if (person instanceof NhanVien) {
        calculationResult = person
          .getSalary()
          .toLocaleString("vi", { style: "currency", currency: "VND" }); // Tính lương
      } else {
        calculationResult = "N/A"; // Không có tính toán cho các loại khác
      }

      row.innerHTML = `
                <td>${person.name}</td>
                <td>${person.address}</td>
                <td>${person.id}</td>
                <td>${person.email}</td>
                <td>${person.constructor.name}</td>
                <td>${calculationResult}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="removePerson('${person.id}')">Delete</button>
                </td>
            `;
      personList.appendChild(row);
    }
  });
}

// Thêm sự kiện cho các biểu tượng lọc
document
  .getElementById("filterSinhVien")
  .addEventListener("click", function () {
    filterPersonList("SinhVien");
  });

document
  .getElementById("filterNhanVien")
  .addEventListener("click", function () {
    filterPersonList("NhanVien");
  });

document
  .getElementById("filterKhachHang")
  .addEventListener("click", function () {
    filterPersonList("KhachHang");
  });

// Thêm sự kiện cho nút reset filter
document.getElementById("resetFilter").addEventListener("click", function () {
  filterPersonList("All");
});

// Initial render
renderPersonList();
