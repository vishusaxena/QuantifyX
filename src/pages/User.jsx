import React, { useState, useEffect } from "react";
import ActionBar from "../components/ActionBar";
import ExportConfirmModal from "../common-components/ExportConfirmModal";
import UserModal from "../components/UserModal";
import { exportTableToExcel } from "../utils/excelconvertor";
import DeleteConfirmModal from "../common-components/DeleteConfirmModal";
import apiCall from "../utils/API";
import transformUsers from "../utils/transformUsers";
import DataTable from "../common-components/DataTable";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const User = () => {
  const [userData, setUserData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [isExportClicked, setIsExportClicked] = useState(false);
  const [isConfirmModalClicked, setIsConfirmModalClicked] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const { t } = useTranslation();

  const fetchData = async () => {
    const res = await apiCall("get", "/users");
    if (!res.ok) {
      toast.error((t("error_fetching_users")));
      return;
    }

    const transformed = transformUsers(await res.json());
    setUserData(transformed);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isConfirmModalClicked) exportTableToExcel("tableData", "data.xlsx");

  const addUser = async (newUser) => {
    try {
      const res = await apiCall("post", "/users", newUser);

      if (!res.ok) {
        toast.error(t("failed_to_add_user"));
        throw new Error((t("failed_to_add_user")));
      }

      const savedUser = await res.json();

      const transformed = transformUsers([savedUser]).Data[0];

      setUserData((prev) => ({
        ...prev,
        Data: [transformed, ...prev.Data],
      }));

      toast.success(t("user_added_successfully"));

      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error(t("failed_to_add_user"));
    }
  };

  const updateUser = async (updatedUser) => {
    console.log(updatedUser);
    try {
      const res = await apiCall(
        "put",
        `/users/${updatedUser._id}`,
        updatedUser
      );
      if (!res.ok) {
        toast.error(t("failed_to_update_user"));
        throw new Error(t("failed_to_update_user"));
      }
      toast.success(t("user_updated_successfully"));
      const updatedRow = transformUsers([res]).Data[0];
      setUserData((prev) => {
        const updatedRows = prev.Data.map((row) =>
          row._id === res._id ? updatedRow : row
        );
        return { ...prev, Data: updatedRows };
      });
    } catch (err) {
      toast.error(t("failed_to_update_user"));
    }

    setIsModalOpen(false);
  };

  const deleteUser = async (id) => {
    try {
      const res = await apiCall("delete", `/users/${id}`);
      if (!res.ok) {
        toast.error(t("failed_to_delete_user"));
        throw new Error(t("failed_to_delete_user"));
      }

      toast.success(t("user_deleted_successfully"));
      setUserData((prev) => {
        const filtered = prev.Data.filter((user) => user._id !== id);
        return { ...prev, Data: filtered };
      });
    } catch (err) {
      toast.error(t("failed_to_delete_user"));
    }
  };

  const openForEdit = (row) => {
    console.log(row);
    const mappedToBacked = {
      _id: row._id,
      username: row.Username,
      email: row.Email,
      firstname: row["First name"],
      lastname: row["Last name"],
      phone: row["Phone No"],
      city: row.City,
      street: row.Street,
      zipcode: row.Zipcode,
    };
    setEditUser(mappedToBacked);
    setIsModalOpen(true);
  };

  return (
    <div className=" h-full ">
      <ActionBar
        masterName={t("userMaster")}
        buttonName={t("addUser")}
        onOpen={() => {
          setEditUser(null);
          setIsModalOpen(true);
        }}
        onClicked={() => setIsExportClicked(true)}
      />

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={editUser}
        onSave={addUser}
        onUpdate={updateUser}
      />

      <ExportConfirmModal
        onConfirm={() => {
          setIsConfirmModalClicked(true);
          setIsExportClicked(false);
        }}
        show={isExportClicked}
        onHide={() => {
          setIsExportClicked(false);
          setIsConfirmModalClicked(false);
        }}
      />

      <DataTable
        data={userData}
        onEdit={openForEdit}
        onDelete={deleteUser}
        page={page}
        perPage={perPage}
        onPageChange={setPage}
        onPerPageChange={setPerPage}
        tableId="user-data-table"
        onOpen={(row) => {
          setDeleteTarget(row);
          setIsDeleteModalOpen(true);
        }}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={() => {
          deleteUser(deleteTarget._id);
          setDeleteTarget(null);
          setIsDeleteModalOpen(false);
        }}
      />
    </div>
  );
};

export default User;
