import React, { useEffect, useRef, useState } from "react";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import InputComponent from "../common-components/InputComponent";
import { usedata } from "../context/dataContext";
import { RefreshCw, Save } from "lucide-react";
import { useTranslation } from "react-i18next";

export const currentDate = () => {
  let date = new Date().toISOString().split("T")[0];
  date = new Date(date);
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-GB", { month: "short" });
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const TeamModal = ({
  isOpen,
  onClose,
  addTeam,
  updateTeam,
  editTeam,
  resetTeam,
}) => {
  const { t } = useTranslation();
  const { currentUser } = usedata();

  const defaultData = {
    teamName: "",
    isActive: true,
    createdBy: currentUser.name,
    createdDate: currentDate(),
    modifiedBy: "",
    modifiedDate: "",
  };

  const [formData, setFormData] = useState(defaultData);
  const [errors, setErrors] = useState({});
  const isEdit = !!editTeam;

  const inputRefs = useRef({});

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRefs?.current?.teamName?.focus(), 200);
    }
  }, [isOpen]);

  useEffect(() => {
    if (editTeam) setFormData(editTeam);
    else setFormData(defaultData);
  }, [editTeam, isOpen]);

  const handleChange = (e) => {
    const { name, checked, type, value } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.teamName.trim())
      newErrors.teamName = t("teamModal.errors.teamNameRequired");

    if (!formData.createdBy.trim())
      newErrors.createdBy = t("teamModal.errors.required");

    if (!formData.createdDate.trim())
      newErrors.createdDate = t("teamModal.errors.required");

    setErrors(newErrors);
    setTimeout(() => setErrors({}), 2000);

    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    if (isEdit) updateTeam(formData);
    else addTeam(formData);
    onClose();
  };

  const handleReset = () => {
    if (isEdit) {
      setFormData({ ...editTeam, teamName: "", modifiedBy: "" });
    } else {
      setFormData(defaultData);
    }
    setErrors({});
    setTimeout(() => refs.teamName.current?.focus(), 100);
  };

  const handleKeyDown = (e, nextFieldName) => {
    if (e.key !== "Enter") return;

    e.preventDefault();

    if (!nextFieldName) return;

    let nextField = inputRefs.current[nextFieldName];

    while (nextField && nextField.disabled) {
      const keys = Object.keys(inputRefs.current);
      console.log(keys);
      const currentIndex = keys.indexOf(nextFieldName);

      if (currentIndex === -1 || currentIndex + 1 >= keys.length) return;

      nextFieldName = keys[currentIndex + 1];
      nextField = inputRefs.current[nextFieldName];
    }

    if (nextField) {
      nextField.focus();
    }
  };

  return (
    <Modal
      show={isOpen}
      onHide={() => {
        onClose();
        resetTeam();
      }}
      centered
      size="lg"
      backdrop="static"
      dialogClassName="modal-fullscreen-sm-down"
      className="modal-custom custom-dialog"
      backdropClassName="custom-backdrop"
    >
      <Modal.Header
        closeButton
        className="custom-close-btn dark:bg-[#141b34] dark:text-gray-200 blue:bg-[#282828] blue:text-[#ffffff] no-border"
      >
        <Modal.Title>
          {isEdit ? t("teamModal.editTeam") : t("teamModal.addTeam")}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body
        style={{ padding: "25px" }}
        className="dark:bg-[#141b34] blue:bg-[#282828] blue:text-[#ffffff]"
      >
        <Form>
          <Row>
            <Col md={4}>
              <InputComponent
                label={t("teamModal.teamName")}
                name="teamName"
                maxLength={50}
                value={formData.teamName}
                onChange={handleChange}
                ref={(el) => (inputRefs.current.teamName = el)}
                onKeyDown={(e) => handleKeyDown(e, "createdBy")}
                error={errors.teamName}
              />
            </Col>

            <Col md={4}>
              <InputComponent
                label={t("teamModal.createdBy")}
                name="createdBy"
                maxLength={50}
                value={formData.createdBy}
                onChange={handleChange}
                ref={(el) => (inputRefs.current.createdBy = el)}
                onKeyDown={(e) => handleKeyDown(e, "createdDate")}
                error={errors.createdBy}
                disabled
              />
            </Col>
            <Col md={4}>
              <InputComponent
                type="text"
                label={t("teamModal.createdDate")}
                name="createdDate"
                value={formData.createdDate}
                onChange={handleChange}
                ref={(el) => (inputRefs.current.createdDate = el)}
                onKeyDown={(e) => handleKeyDown(e, "modifiedBy")}
                error={errors.createdDate}
                disabled
              />
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <InputComponent
                label={t("teamModal.modifiedBy")}
                name="modifiedBy"
                maxLength={50}
                value={formData.modifiedBy}
                onChange={handleChange}
                ref={(el) => (inputRefs.current.modifiedBy = el)}
                onKeyDown={(e) => handleKeyDown(e, "modifiedDate")}
                disabled={!isEdit}
              />
            </Col>
            <Col md={4}>
              <InputComponent
                type="text"
                label={t("teamModal.modifiedDate")}
                name="modifiedDate"
                value={formData.modifiedDate}
                onChange={handleChange}
                ref={(el) => (inputRefs.current.modifiedDate = el)}
                onKeyDown={(e) => handleKeyDown(e, "isActive")}
                disabled
              />
            </Col>
          </Row>

          <Form.Check
            className="mt-3"
            type="switch"
            id="team-active"
            label={t("teamModal.active")}
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            ref={(el) => (inputRefs.current.isActive = el)}
            onKeyDown={(e) => handleKeyDown(e, "saveBtn")}
          />
        </Form>
      </Modal.Body>

      <div className="dark:bg-[#141b34] blue:bg-[#282828] blue:text-[#ffffff]">
        <Modal.Footer className="no-border">
          <button
            ref={(el) => (inputRefs.current.saveBtn = el)}
            onClick={handleSave}
            className="
              d-flex align-items-center gap-2 
              px-4 py-2 fw-medium rounded-3 shadow-sm 
              border-0
              text-white
              bg-linear-to-r from-blue-600 to-blue-700
              hover:shadow-lg hover:scale-105
              transition-all duration-200
            "
          >
            <Save size={18} />
            {isEdit ? t("teamModal.update") : t("teamModal.save")}
          </button>
          <button
            onClick={handleReset}
            className="
              focus:ring-green-500
              d-flex align-items-center gap-2 
              px-4 py-2 fw-medium rounded-3 shadow-sm 
              border-0
              text-white
              bg-linear-to-r from-green-500 to-green-600
              hover:shadow-lg hover:scale-105
              transition-all duration-200
            "
          >
            <RefreshCw size={18} />
            {t("teamModal.reset")}
          </button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default TeamModal;
