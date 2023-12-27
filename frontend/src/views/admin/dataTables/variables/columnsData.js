export const columnsDataDevelopment = [
  {
    Header: "NAME",
    accessor: "name",
  },
  {
    Header: "TECH",
    accessor: "tech",
  },
  {
    Header: "DATE",
    accessor: "date",
  },
  {
    Header: "PROGRESS",
    accessor: "progress",
  },
];

export const columnsDataCheck = [
  {
    Header: "NAME",
    accessor: "name",
  },
  {
    Header: "PROGRESS",
    accessor: "progress",
  },
  {
    Header: "QUANTITY",
    accessor: "quantity",
  },
  {
    Header: "DATE",
    accessor: "date",
  },
];

export const columnsDataColumns = [
  {
    Header: "NAME",
    accessor: "name",
  },
  {
    Header: "PROGRESS",
    accessor: "progress",
  },
  {
    Header: "QUANTITY",
    accessor: "quantity",
  },
  {
    Header: "DATE",
    accessor: "date",
  },
];


export const columnDataTasks = [
  {
    Header: "No",
    accessor: (originalRow, rowIndex) => rowIndex + 1,
  },
  {
    Header: "Task Name",
    accessor: "namaTask",
  },
  {
    Header: "DateLine",
    accessor: "dateLine",
  },
  {
    Header: "Priority",
    accessor: "prioritas",
  },
  {
    Header: "Status",
    accessor: "isCompleted",
    Cell: ({ value }) => (value ? "Completed" : "Incomplete"),
  },
  {
    Header: "Tags",
    accessor: "tags",
    Cell: ({ value }) => value.map((tag) => tag.namaTag).join(", "),
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

export const columnDataTags = [
  {
    Header: "No",
    accessor: (originalRow, rowIndex) => rowIndex + 1,
  },
  {
    Header: "Tag Name",
    accessor: "namaTag",
  },
  {
    Header: "Description",
    accessor: "deskripsi",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

export const columnsDataComplex = [
  {
    Header: "NAME",
    accessor: "name",
  },
  {
    Header: "STATUS",
    accessor: "status",
  },
  {
    Header: "DATE",
    accessor: "date",
  },
  {
    Header: "PROGRESS",
    accessor: "progress",
  },
];
