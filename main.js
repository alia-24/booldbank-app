const myForm = document.getElementById("myForm");
const myResult = document.getElementById("myresult");

function showDataDetails() {
  const dataSaved = localStorage.getItem("userData");
  if (dataSaved) {
    const data = JSON.parse(dataSaved);
    myResult.innerHTML = `
     <h3>✅ البيانات المحفوظة:</h3>
      <p><strong>👤 الاسم:</strong> ${data.name}</p>
      <p><strong>📧 البريد:</strong> ${data.email}</p>
      <p><strong>🎂 العمر:</strong> ${data.age || "غير محدد"}</p>
      <p><strong>⚧ الجنس:</strong> ${data.gender}</p>
      <p><strong>💡 الاهتمامات:</strong> ${data.interests.join(", ") || "لا يوجد"}</p>
    `;
  }
}

myForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const nameValue = document.getElementById("nameid").value;
  const emailValue = document.getElementById("emailid").value;
  const ageValue = document.getElementById("ageid").value;

  const genderRadio = document.querySelector('input[name="gender"]:checked');

  let genderValue = "غير محدد";
  if (genderRadio) {
    genderValue = genderRadio.value === "Male" ? "ذكر" : "أنثى";
  }

  const interestsValue = [];
  const checkboxes = document.querySelectorAll(
    'input[type="checkbox"]:checked',
  );

  checkboxes.forEach((checkbox) => {
    let translation = checkbox.value;
    if (translation === "Coding") translation = "برمجة";
    if (translation === "Design") translation = "تصميم";
    if (translation === "Sports") translation = "رياضة";
    if (translation === "Reading") translation = "قراءة";

    interestsValue.push(translation);
  });

  const allData = {
    name: nameValue,
    email: emailValue,
    age: ageValue,
    gender: genderValue,
    interests: interestsValue,
  };

  localStorage.setItem("userData", JSON.stringify(allData));
  showDataDetails();
  alert("تم حفظ البيانات بنجاح!");
});

showDataDetails();