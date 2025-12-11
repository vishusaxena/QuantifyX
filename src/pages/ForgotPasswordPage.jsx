import React, { useState, useRef, useEffect } from "react";
import logo from "../assets/forgot-password.svg";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [emailId, setEmailId] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);

  const emailRef = useRef(null);
  const passRef = useRef(null);
  const confirmPassRef = useRef(null);

  const navigate = useNavigate();
  const registerData = JSON.parse(localStorage.getItem("registerData")) || [];
  const notify = () => toast(t("forgotPassword.password_updated_successfully"));

  useEffect(() => {
    if (step === 1 && emailRef.current) emailRef.current.focus();
    if (step === 2 && passRef.current) passRef.current.focus();
  }, [step]);

  const getPasswordStrength = (pwd) => {
    if (pwd.length < 6) return t("forgotPassword.weak");
    if (pwd.match(/[A-Z]/) && pwd.match(/[0-9]/) && pwd.length >= 8)
      return t("forgotPassword.strong");
    return t("forgotPassword.medium");
  };

  const strength = password ? getPasswordStrength(password) : "";

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!emailId) {
      setError(t("forgotPassword.please_enter_email"));
      return;
    }

    const emailExist = registerData.find((u) => u.email === emailId);

    if (!emailExist) {
      setError(t("forgotPassword.email_not_found"));
      return;
    }

    setStep(2);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!password || !confirmPassword) {
      setError(t("forgotPassword.please_fill_all_fields"));
      return;
    }

    if (password.length < 6) {
      setError(t("forgotPassword.password_min_length"));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("forgotPassword.passwords_do_not_match"));
      return;
    }

    const encryptedNewPassword = CryptoJS.AES.encrypt(
      password,
      "my-secret-key"
    ).toString();

    const updatedUsers = registerData.map((u) =>
      u.email === emailId ? { ...u, password: encryptedNewPassword } : u
    );

    localStorage.setItem("registerData", JSON.stringify(updatedUsers));

    notify();
    navigate("/login");
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4">
      <div className="flex w-full max-w-4xl shadow-lg rounded-xl p-8 bg-white">
        <div className="hidden md:flex w-1/2 items-center justify-center">
          <img src={logo} alt="Forgot Illustration" className="w-72" />
        </div>

        <div className="w-full md:w-1/2 flex flex-col px-6">
          <h2 className="text-2xl font-semibold mb-3">
            {step === 1
              ? t("forgotPassword.forgot_password")
              : t("forgotPassword.reset_password")}
          </h2>

          {step === 1 && (
            <form onSubmit={handleEmailSubmit} className="flex flex-col gap-2">
              <p className="text-sm opacity-80 mb-1">
                {t("forgotPassword.enter_registered_email")}
              </p>

              <input
                ref={emailRef}
                type="email"
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder={t("forgotPassword.enter_registered_email")}
                value={emailId}
                onChange={(e) => {
                  setEmailId(e.target.value);
                  setError("");
                }}
              />

              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

              <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg mt-2">
                {t("forgotPassword.send_instructions")}
              </button>
            </form>
          )}

          {step === 2 && (
            <form
              onSubmit={handlePasswordSubmit}
              className="flex flex-col gap-2"
            >
              <div className="relative">
                <input
                  ref={passRef}
                  type={showPass1 ? "text" : "password"}
                  className="border rounded-lg w-full px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                  placeholder={t("forgotPassword.new_password")}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                />
                <span
                  className="absolute right-3 top-2.5 cursor-pointer"
                  onClick={() => setShowPass1(!showPass1)}
                >
                  {showPass1 ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>

              {password && (
                <p
                  className={`text-sm mt-1 ${
                    strength === "Weak"
                      ? "text-red-500"
                      : strength === "Medium"
                      ? "text-yellow-500"
                      : "text-green-600"
                  }`}
                >
                  {t("forgotPassword.strength")}: {strength}
                </p>
              )}

              <div className="relative mt-1">
                <input
                  ref={confirmPassRef}
                  type={showPass2 ? "text" : "password"}
                  className="border rounded-lg w-full px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                  placeholder={t("forgotPassword.confirm_password")}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError("");
                  }}
                />
                <span
                  className="absolute right-3 top-2.5 cursor-pointer"
                  onClick={() => setShowPass2(!showPass2)}
                >
                  {showPass2 ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>

              {confirmPassword && (
                <p
                  className={`text-sm mt-1 ${
                    password === confirmPassword
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {password === confirmPassword
                    ? t("forgotPassword.passwords_match")
                    : t("forgotPassword.passwords_do_not_match")}
                </p>
              )}

              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

              <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg mt-2">
                {t("forgotPassword.reset_password")}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
