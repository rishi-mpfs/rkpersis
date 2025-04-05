const loginContainer = document.getElementById("loginContainer");

let step = "login";
let phoneNumber = "";
let otp = "";
let loading = false;
let errorMessage = "";

function render() {
  loginContainer.innerHTML = "";

  const wrapper = document.createElement("div");

  if (step === "login") {
    wrapper.innerHTML = `
      <h1 class="crhead">CREATE ACCOUNT</h1>
      <div class="gl_con" onclick="handleGoogleLogin()">
        <img src="assets/google.png" alt="Google logo" />
        <h4>Continue with Google</h4>
      </div>
      <div class="orline">
        <span></span>
        <h1>or</h1>
        <span></span>
      </div>
      <div class="ml_con">
        <label>Mobile Number</label>
        <div class="phoneinputcon">
          <span>+91</span>
          <input type="text" id="phoneInput" value="${phoneNumber}" maxlength="10" />
        </div>
        <button onclick="handleGetOTP()">GET OTP</button>
        ${errorMessage ? `<p class="error">${errorMessage}</p>` : ""}
      </div>
    `;
  } else {
    wrapper.innerHTML = `
      <button onclick="handleBack()" class="lgbackbtn">⬅ Back</button>
      <div class="ml_con">
        <label>Mobile Number</label>
        <div class="phoneinputcon">
          <span>+91</span>
          <input type="text" value="${phoneNumber}" disabled />
        </div>
      </div>
      <div class="ml_otpcon ml_con">
        <label>Enter the OTP sent to +91 ${phoneNumber}</label>
        <input type="text" id="otpInput" value="${otp}" maxlength="6" />
        <button class="veribtn" onclick="handleVerifyOTP()">PROCEED</button>
        ${errorMessage ? `<p class="error">${errorMessage}</p>` : ""}
      </div>
    `;
  }

  loginContainer.appendChild(wrapper);

  if (step === "login") {
    document.getElementById("phoneInput").addEventListener("input", (e) => {
      phoneNumber = e.target.value;
    });
  } else {
    document.getElementById("otpInput").addEventListener("input", (e) => {
      otp = e.target.value;
    });
  }
}

function handleGoogleLogin() {
  window.location.href = "http://localhost:5000/auth/google";
}

function handleBack() {
  step = "login";
  otp = "";
  errorMessage = "";
  render();
}

async function handleGetOTP() {
  errorMessage = "";
  if (!/^\d{10}$/.test(phoneNumber)) {
    errorMessage = "Enter a valid 10-digit mobile number";
    render();
    return;
  }

  try {
    loading = true;
    const res = await fetch("http://localhost:5000/auth/otp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: `+91${phoneNumber}` }),
    });

    const data = await res.json();
    console.log("OTP Sent:", data);
    step = "verify";
  } catch (err) {
    console.error("Error sending OTP", err);
    errorMessage = "Error sending OTP. Try again.";
  } finally {
    loading = false;
    render();
  }
}

async function handleVerifyOTP() {
  errorMessage = "";
  if (otp.length !== 6) {
    errorMessage = "Enter a valid 6-digit OTP";
    render();
    return;
  }

  try {
    loading = true;
    const res = await fetch("http://localhost:5000/auth/otp/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ phone: `+91${phoneNumber}`, otp }),
    });

    const data = await res.json();
    if (data.code === 200 ) {
    //   localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "dashboard.html";
    } else {
      errorMessage = "Invalid OTP. Please try again.";
    }
  } catch (err) {
    console.error("OTP verify failed:", err);
    errorMessage = "Error verifying OTP.";
  } finally {
    loading = false;
    render();
  }
}

render(); // initial render
