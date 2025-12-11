import React, { useEffect, useState, useRef } from "react";
import DataTable from "../common-components/DataTable";
import { packageData } from "../data/packageData";
import DeleteConfirmModal from "../common-components/DeleteConfirmModal";
import { Inbox } from "lucide-react";
import DeletedLog from "../components/DeletedLog";
import ActionBar from "../components/ActionBar";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

const OrderData = () => {
  const savedData = JSON.parse(localStorage.getItem("orderData") || "null");

  const tempData =
    savedData && savedData.Data?.length > 0 ? savedData : packageData;

  const [data, setData] = useState(tempData);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const { t } = useTranslation();

  const [deletedLog, setDeletedLog] = useState(
    JSON.parse(localStorage.getItem("deletedLog") || "[]")
  );

  const logRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("orderData", JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    localStorage.setItem("deletedLog", JSON.stringify(deletedLog));
  }, [deletedLog]);

  useEffect(() => {
    if (deletedLog.length > 0) {
      const sorted = [...deletedLog].sort(
        (a, b) => new Date(b.deletedAt) - new Date(a.deletedAt)
      );
      setDeletedLog(sorted);
    }
  }, []);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = 0;
    }
  }, [deletedLog]);

  const handleBulkDelete = () => {
    const timestamp = new Date().toISOString();

    const deletedItems = data.Data.filter((prev) =>
      selectedRows.includes(prev.AwbNo)
    ).map((item) => ({
      ...item,
      deletedAt: timestamp,
      note: `This entry was deleted at ${new Date(timestamp).toLocaleString()}`,
    }));
    toast.success(t("deletedLog.entries_deleted_successfully"));
    const updatedLog = [...deletedItems, ...deletedLog].sort(
      (a, b) => new Date(b.deletedAt) - new Date(a.deletedAt)
    );

    setDeletedLog(updatedLog);

    const updatedData = data.Data.filter(
      (prev) => !selectedRows.includes(prev.AwbNo)
    );

    setData({ ...data, Data: updatedData });
    setSelectedRows([]);
  };

  return (
    <div className="">
      <ActionBar masterName={t("orderMaster")} />

      {data?.Data?.length > 0 ? (
        <DataTable
          data={data}
          page={page}
          perPage={perPage}
          onPageChange={setPage}
          onPerPageChange={setPerPage}
          onRowSelect={(d) => setSelectedRows(d)}
          onOpen={() => setIsDeleteModalOpen(true)}
          selectedRows={selectedRows}
          tableId="order-data-table"
        />
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-gray-500 dark:text-gray-300">
          <Inbox className="w-12 h-12 mb-2" />
          <p className="text-lg font-semibold">No data available</p>
        </div>
      )}

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          handleBulkDelete();
          setIsDeleteModalOpen(false);
        }}
        title={t("Are you sure you want to delete it")}
      />
      <DeletedLog deletedLog={deletedLog} />
    </div>
  );
};

export default OrderData;
