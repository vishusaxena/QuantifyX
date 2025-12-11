import React, { useEffect, useRef, useState } from "react";
import InputComponent from "../common-components/InputComponent";
import { usedata } from "../context/dataContext";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";
import { MoveLeft } from "lucide-react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next"; // ✅ translation hook

const PasswordReset = () => {
  const { t } = useTranslation();
  const { currentUser, logout } = usedata();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [strength, setStrength] = useState("");
  const [matchStatus, setMatchStatus] = useState("");

  const inputRefs = useRef({
    newPassword: null,
    confirmNewPassword: null,
    resetBtn: null,
  });

  useEffect(() => {
    inputRefs.current.newPassword?.focus();
  }, []);

  const getPasswordStrength = (pwd) => {
    if (!pwd) return "";
    const strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    const medium = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

    if (strong.test(pwd)) return "Strong";
    if (medium.test(pwd)) return "Medium";
    return "Weak";
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.newPassword)
      newErrors.newPassword = t("passwordReset.errors.newPasswordRequired");

    if (!formData.confirmNewPassword)
      newErrors.confirmNewPassword = t(
        "passwordReset.errors.confirmPasswordRequired"
      );

    if (
      formData.newPassword &&
      formData.confirmNewPassword &&
      formData.newPassword !== formData.confirmNewPassword
    ) {
      newErrors.confirmNewPassword = t(
        "passwordReset.errors.passwordsNotMatch"
      );
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResetPassword = () => {
    if (!validate()) return;

    const stored = JSON.parse(localStorage.getItem("registerData"));

    if (!stored || stored.length === 0) {
      toast.error(t("passwordReset.errors.noUserFound"));
      return;
    }

    const encryptedNewPassword = CryptoJS.AES.encrypt(
      formData.newPassword,
      "my-secret-key"
    ).toString();

    const updatedData = stored.map((u) =>
      u.email === currentUser.email
        ? { ...u, password: encryptedNewPassword }
        : u
    );

    localStorage.setItem("registerData", JSON.stringify(updatedData));

    toast.success(t("passwordReset.toast.success"));

    logout();
  };

  const strengthColor = {
    Weak: "text-red-500",
    Medium: "text-yellow-500",
    Strong: "text-green-500",
  };

  return (
    <div className="flex flex-col">
      {/* Back Button */}
      <div className="ml-15 dark:text-white blue:text-white">
        <button className="flex gap-2" onClick={() => navigate("/")}>
          <MoveLeft /> <span>{t("passwordReset.back")}</span>
        </button>
      </div>

      <div className="w-full flex justify-start items-center pl-16 h-full py-10">
        <div className="w-[40%] flex flex-col gap-4 dark:text-white blue:text-white">
          <h3 className="text-xl font-semibold">
            {t("passwordReset.resetPasswordTitle")}
          </h3>

          <div className="flex flex-col gap-3">
            {/* New password */}
            <div>
              <InputComponent
                label={t("passwordReset.newPassword")}
                name="newPassword"
                type="password"
                placeholder={t("passwordReset.newPasswordPlaceholder")}
                value={formData.newPassword}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({ ...formData, newPassword: value });
                  setStrength(getPasswordStrength(value));
                }}
                ref={(el) => (inputRefs.current.newPassword = el)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    inputRefs.current.confirmNewPassword?.focus();
                  }
                }}
              />

              {strength && (
                <p
                  className={`text-sm font-medium mt-1 ${strengthColor[strength]}`}
                >
                  {t("passwordReset.passwordStrength")}: {strength}
                </p>
              )}

              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.newPassword}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <InputComponent
                label={t("passwordReset.confirmNewPassword")}
                name="confirmNewPassword"
                type="password"
                placeholder={t("passwordReset.confirmNewPasswordPlaceholder")}
                value={formData.confirmNewPassword}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({
                    ...formData,
                    confirmNewPassword: value,
                  });
                  setMatchStatus(
                    value === formData.newPassword
                      ? t("passwordReset.passwordsMatch")
                      : t("passwordReset.passwordsDoNotMatch")
                  );
                }}
                ref={(el) => (inputRefs.current.confirmNewPassword = el)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    inputRefs.current.resetBtn?.focus();
                  }
                }}
              />

              {matchStatus && (
                <p
                  className={`text-sm mt-1 ${
                    matchStatus === t("passwordReset.passwordsMatch")
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {matchStatus}
                </p>
              )}

              {errors.confirmNewPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmNewPassword}
                </p>
              )}
            </div>

            {/* Reset button */}
            <button
              onClick={handleResetPassword}
              className="rounded-md bg-blue-500 py-2 text-white hover:bg-blue-600 transition"
              ref={(el) => (inputRefs.current.resetBtn = el)}
            >
              {t("passwordReset.resetButton")}
            </button>
          </div>
        </div>

        {/* Requirements Box */}
        <div className="ml-15 p-5 light:bg-gray-100 dark:bg-[#141b34] blue:bg-[#282828] light:text-black blue:text-white dark:text-gray-200 rounded-lg shadow w-[45%]">
          <h4 className="text-lg font-semibold mb-2">
            {t("passwordReset.requirementsTitle")}
          </h4>

          <ul className="text-sm text-gray-700 leading-6 blue:text-white dark:text-gray-200">
            <li>• {t("passwordReset.req1")}</li>
            <li>• {t("passwordReset.req2")}</li>
            <li>• {t("passwordReset.req3")}</li>
            <li>• {t("passwordReset.req4")}</li>
            <li>• {t("passwordReset.req5")}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
