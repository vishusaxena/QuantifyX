import React from "react";
import { Modal, Button } from "react-bootstrap";
import { Download } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";

const ExportConfirmModal = ({ show, onHide, onConfirm }) => {
  const { t } = useTranslation();

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      backdrop="static"
      keyboard={false}
    >
      <div className="text-center p-4 dark:bg-[#141b34] blue:bg-[#282828] blue:text-[#ffffff]">
        <div
          style={{
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            backgroundColor: "#e0f3ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 15px",
          }}
        >
          <Download size={34} color="#0d6efd" />
        </div>

        <div className="dark:text-gray-200">
          <h4 className="fw-bold mb-2">{t("exportConfirmModalPage.title")}</h4>
          <p>{t("exportConfirmModalPage.text")}</p>
        </div>

        <div className="d-flex justify-content-center gap-3 mt-3">
          <Button
            variant="primary"
            onClick={onConfirm}
            style={{ minWidth: "120px" }}
          >
            {t("exportConfirmModalPage.confirm")}
          </Button>

          <Button
            variant="secondary"
            onClick={onHide}
            style={{ minWidth: "120px" }}
          >
            {t("exportConfirmModalPage.cancel")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ExportConfirmModal;
