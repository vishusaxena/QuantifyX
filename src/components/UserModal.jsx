import React, { useEffect, useState, useRef } from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";
import InputComponent from "../common-components/InputComponent";
import { RefreshCw, Save } from "lucide-react";
import { useTranslation } from "react-i18next";

const Usermodal = ({ isOpen, onClose, onSave, onUpdate, user }) => {
  const { t } = useTranslation();

  const defaultData = {
    email: "",
    username: "",
    firstname: "",
    lastname: "",
    phone: "",
    city: "",
    street: "",
    zipcode: "",
  };

  const [form, setForm] = useState(defaultData);
  const [errors, setErrors] = useState({});

  const fnameRef = useRef(null);
  const lnameRef = useRef(null);
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const streetRef = useRef(null);
  const cityRef = useRef(null);
  const zipRef = useRef(null);
  const resetRef = useRef(null);
  const saveRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setForm(user || defaultData);
      setErrors({});
      setTimeout(() => fnameRef.current?.focus(), 100);
    }
  }, [isOpen, user]);

  const handleChange = (e) => {
    const { name, value: rawValue } = e.target;
    setErrors((prev) => ({ ...prev, [name]: "" }));

    let value = rawValue;
    if (name === "phone" || name === "zipcode") {
      value = rawValue.replace(/\D/g, "");
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.firstname.trim())
      newErrors.firstname = t("error_firstname_required");

    if (!form.lastname.trim())
      newErrors.lastname = t("error_lastname_required");

    if (!form.username.trim())
      newErrors.username = t("error_username_required");

    if (!form.email.trim()) newErrors.email = t("error_email_required");
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      newErrors.email = t("error_email_invalid");

    if (!form.phone.trim()) newErrors.phone = t("error_phone_required");
    else if (!/^[6-9][0-9]{9}$/.test(form.phone))
      newErrors.phone = t("error_phone_invalid");

    if (!form.street.trim()) newErrors.street = t("error_street_required");

    if (!form.city.trim()) newErrors.city = t("error_city_required");

    if (!form.zipcode.trim()) newErrors.zipcode = t("error_zip_required");
    else if (!/^[0-9]{5,6}$/.test(form.zipcode))
      newErrors.zipcode = t("error_zip_invalid");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEnter = (e, nextRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      nextRef.current?.focus();
    }
  };

  const handleSubmit = () => {
    if (!validate()) return;
    user ? onUpdate(form) : onSave(form);
  };

  const handleReset = () => {
    setForm(defaultData);
    setErrors({});
    setTimeout(() => fnameRef.current?.focus(), 100);
  };

  return (
    <Modal
      show={isOpen}
      onHide={onClose}
      centered
      size="lg"
      backdrop="static"
      className="custom-dialog"
    >
      <Modal.Header
        closeButton
        className="custom-close-btn dark:bg-[#141b34] dark:text-gray-200 blue:bg-[#282828] blue:text-[#ffffff] no-border"
      >
        <Modal.Title>{user ? t("edit_user") : t("add_user")}</Modal.Title>
      </Modal.Header>

      <Modal.Body className="dark:bg-[#141b34] dark:text-gray-200 blue:bg-[#282828] blue:text-[#ffffff]">
        <Row>
          <Col md={4}>
            <InputComponent
              label={t("firstname")}
              name="firstname"
              value={form.firstname}
              ref={fnameRef}
              onChange={handleChange}
              onKeyDown={(e) => handleEnter(e, lnameRef)}
              error={errors.firstname}
            />
          </Col>
          <Col md={4}>
            <InputComponent
              label={t("lastname")}
              name="lastname"
              value={form.lastname}
              ref={lnameRef}
              onChange={handleChange}
              onKeyDown={(e) => handleEnter(e, usernameRef)}
              error={errors.lastname}
            />
          </Col>
          <Col md={4}>
            <InputComponent
              label={t("username")}
              name="username"
              value={form.username}
              ref={usernameRef}
              onChange={handleChange}
              onKeyDown={(e) => handleEnter(e, emailRef)}
              error={errors.username}
            />
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <InputComponent
              label={t("email")}
              name="email"
              value={form.email}
              ref={emailRef}
              onChange={handleChange}
              onKeyDown={(e) => handleEnter(e, phoneRef)}
              error={errors.email}
            />
          </Col>
          <Col md={4}>
            <InputComponent
              label={t("phone")}
              name="phone"
              value={form.phone}
              ref={phoneRef}
              maxLength={10}
              inputMode="numeric"
              onChange={handleChange}
              onKeyDown={(e) => handleEnter(e, streetRef)}
              error={errors.phone}
            />
          </Col>

          <Col md={4}>
            <InputComponent
              label={t("street")}
              name="street"
              value={form.street}
              ref={streetRef}
              onChange={handleChange}
              onKeyDown={(e) => handleEnter(e, cityRef)}
              error={errors.street}
            />
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <InputComponent
              label={t("city")}
              name="city"
              value={form.city}
              ref={cityRef}
              onChange={handleChange}
              onKeyDown={(e) => handleEnter(e, zipRef)}
              error={errors.city}
            />
          </Col>

          <Col md={4}>
            <InputComponent
              label={t("zipcode")}
              name="zipcode"
              value={form.zipcode}
              ref={zipRef}
              maxLength={6}
              inputMode="numeric"
              onChange={handleChange}
              onKeyDown={(e) => handleEnter(e, saveRef)}
              error={errors.zipcode}
            />
          </Col>
        </Row>
      </Modal.Body>
      <div className="dark:bg-[#141b34] dark:text-gray-200 blue:bg-[#282828] blue:text-[#ffffff]">
        <Modal.Footer className="no-border">
          <button
            ref={saveRef}
            onClick={handleSubmit}
            className="
            d-flex align-items-center gap-2 
            px-4 py-2 fw-medium rounded-3 shadow-sm 
            border-0 text-white
            bg-linear-to-r from-blue-600 to-blue-700
            hover:shadow-lg hover:scale-105
            transition-all duration-200
          "
          >
            <Save size={18} />
            {user ? t("update") : t("save")}
          </button>
          <Button
            ref={resetRef}
            variant="secondary"
            onClick={handleReset}
            onKeyDown={(e) => handleEnter(e, saveRef)}
            className="
            d-flex align-items-center gap-2 
            px-4 py-2 fw-medium rounded-3 shadow-sm 
            border-0 text-white
            bg-linear-to-r from-green-500 to-green-600
            hover:shadow-lg hover:scale-105
            transition-all duration-200
          "
          >
            <RefreshCw size={18} />
            {t("reset")}
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default Usermodal;
