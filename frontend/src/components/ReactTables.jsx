import React from "react";
import DataTable from "react-data-table-component";
import { Box, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const ReactTables = ({ data, handleUpdate, handleDelete, setValues }) => {
  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
    },
    {
      name: "Email",
      selector: (row) => row.email,
    },
    {
      name: "Phone",
      selector: (row) => row.phoneNumber,
    },
    {
      name: "Description",
      selector: (row) => row.description,
    },
    {
      name: "Skills",
      selector: (row) => row.skills.join(", "),
    },
    {
      name: "Actions",
      cell: (row) => (
        <Stack direction="row" gap={2}>
          <Tooltip title="update" disableInteractive>
            <IconButton color="primary" onClick={() => handleUpdate(row, setValues)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="delete" disableInteractive>
            <IconButton color="error" onClick={() => handleDelete(row.id)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <div>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default ReactTables;
