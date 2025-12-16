import React, { useState, useEffect } from "react";
import ActionBar from "../components/ActionBar";
import ExportConfirmModal from "../common-components/ExportConfirmModal";
import DataTable from "../common-components/DataTable";
import TeamModal from "../components/TeamModal";
import teamsData from "../data/teamsData";
import { exportTableToExcel } from "../utils/excelconvertor";
import DeleteConfirmModal from "../common-components/DeleteConfirmModal";
import { currentDate } from "../components/TeamModal";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
const Team = () => {
  const LOCAL_KEY = "teamDataLocal";
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [teamData, setTeamData] = useState(() => {
    const stored = localStorage.getItem(LOCAL_KEY);
    return stored ? JSON.parse(stored) : teamsData;
  });
  const [editTeam, setEditTeam] = useState(null);
  const [isExportClicked, setIsExportClicked] = useState(false);
  const [isConfirmModalClicked, setIsConfirmModalClicked] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const { t } = useTranslation();

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(teamData));
    const totalPages = Math.ceil(teamData.Data.length / perPage);

    if (page > totalPages) {
      setPage(totalPages || 1);
    }
  }, [teamData, perPage]);

  if (isConfirmModalClicked) {
    exportTableToExcel("tableData", "team-data.xlsx");
    setIsConfirmModalClicked(false);
  }

  const addTeam = (team) => {
    setTeamData((prev) => {
      const newTeam = {
        SrNo: prev.Data.length + 1,
        "Team Name": team.teamName || "",
        Active: team.isActive ? "Yes" : "No",
        "Created By": team.createdBy || "",
        "Created Date": team.createdDate || "",
        "Modified By": "",
        "Modified Date": "",
      };

      return {
        ...prev,
        TotalRecord: prev.TotalRecord + 1,
        Data: [newTeam, ...prev.Data],
      };
    });
    toast.success("Team added successfully !");
  };

  const openForEdit = (row) => {
    const converted = {
      SrNo: row.SrNo,
      teamName: row["Team Name"],
      createdBy: row["Created By"],
      createdDate: row["Created Date"],
      modifiedBy: row["Modified By"] || "",
      modifiedDate: currentDate(),
      isActive: row.Active === "Yes",
    };

    setEditTeam(converted);
    setIsTeamModalOpen(true);
  };

  const updateTeam = (updated) => {
    setTeamData((prev) => {
      const newData = prev.Data.map((row) =>
        row.SrNo === updated.SrNo
          ? {
              SrNo: updated.SrNo,
              "Team Name": updated.teamName,
              Active: updated.isActive ? "Yes" : "No",
              "Created By": updated.createdBy,
              "Created Date": updated.createdDate,
              "Modified By": updated.modifiedBy,
              "Modified Date": updated.modifiedDate,
            }
          : row
      );

      return { ...prev, Data: newData };
    });
    toast.success("Team updated successfully !");
  };

  const deleteTeam = (SrNo) => {
    setTeamData((prev) => {
      const filtered = prev.Data.filter((row) => row.SrNo !== SrNo);

      const rebuilt = filtered.map((item, index) => ({
        ...item,
        SrNo: index + 1,
      }));

      return {
        ...prev,
        TotalRecord: rebuilt.length,
        Data: rebuilt,
      };
    });
    toast.success("Team deleted successfully !");
  };

  const resetTeam = () => {
    setEditTeam(null);
  };

  return (
    <div>
      <ActionBar
        masterName={t("teamMaster")}
        buttonName={t("addTeam")}
        onOpen={() => {
          setEditTeam(null);
          setIsTeamModalOpen(true);
        }}
        onClicked={() => setIsExportClicked(true)}
      />

      <TeamModal
        isOpen={isTeamModalOpen}
        onClose={() => {
          setIsTeamModalOpen(false), resetTeam();
        }}
        addTeam={addTeam}
        updateTeam={updateTeam}
        editTeam={editTeam}
        resetTeam={resetTeam}
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
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        deleteTarget={deleteTarget}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={() => {
          deleteTeam(deleteTarget.SrNo);
          setDeleteTarget(null);
          setIsDeleteModalOpen(false);
        }}
        title={t("Are you sure you want to delete it")}
      />

      <DataTable
        data={teamData}
        onEdit={openForEdit}
        onDelete={deleteTeam}
        page={page}
        perPage={perPage}
        onPageChange={setPage}
        onPerPageChange={setPerPage}
        tableId="team-data-table"
        onOpen={(row) => {
          setDeleteTarget(row);
          setIsDeleteModalOpen(true);
        }}
      />
    </div>
  );
};

export default Team;
