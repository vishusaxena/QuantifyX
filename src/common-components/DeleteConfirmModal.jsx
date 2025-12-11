import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import InputComponent from "./InputComponent";

const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  isConfirmInput,
  onInput,
  title,
}) => {
  const { t } = useTranslation();
  const [remark, setRemark] = useState("");
  const [remarkError, setRemarkError] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (isConfirmInput) {
      if (!remark.trim()) {
        setRemarkError("Remarks cannot be empty");
        return;
      }
      setRemarkError("");
    }

    onConfirm();
    setRemark("");
  };

  const handleInputChange = (value) => {
    setRemark(value);
    setRemarkError("");
    onInput(value);
  };

  return (
    <Modal show={isOpen} centered backdrop="static" className="rounded-3xl">
      <Modal.Body className="text-center py-5 dark:bg-[#141b34] blue:bg-[#282828] blue:text-[#ffffff]  dark:text-white">
        <div className="text-red-600 text-6xl mb-3">⚠</div>
        <h4 className="dark:text-gray-200">{title}</h4>

        {isConfirmInput && (
          <div className="text-start mt-3">
            <InputComponent
              label={t("remark")}
              name="remarks"
              isRequired={true}
              placeholder={t("remark")}
              value={remark}
              onChange={(e) => handleInputChange(e.target.value)}
            />

            {remarkError && (
              <small
                className="dark:text-red-400 light:text-red-500 blue:text-red-400"
                style={{ fontSize: 12 }}
              >
                {remarkError}
              </small>
            )}
          </div>
        )}
      </Modal.Body>

      <div className="dark:bg-[#141b34] blue:bg-[#282828] blue:text-[#ffffff]">
        <Modal.Footer className="d-flex justify-content-center">
          <Button variant="secondary" onClick={onClose}>
            {t("cancel")}
          </Button>

          <Button variant="danger" onClick={handleConfirm}>
            {isConfirmInput ? "Confirm" : t("delete")}
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;
