export const DOC_TYPES = {
IMG: "img",
  ALL: "all",
  PDF: "pdf",
  DOC: "doc",
  XLS: "xls",
 
};

export const MOCK_DOCUMENTS = [
  {
    id: "1",
    type: DOC_TYPES.PDF,
    title: "Project Proposal",
    uri: "", // plug in later
    meta: { width: 1240, height: 1754 }, // A4-ish
  },
  {
    id: "2",
    type: DOC_TYPES.DOC,
    title: "Meeting Notes",
    uri: "",
    meta: { width: 1024, height: 768 },
  },
  {
    id: "3",
    type: DOC_TYPES.XLS,
    title: "Budget Sheet",
    uri: "",
    meta: { width: 1400, height: 900 },
  },
  {
    id: "4",
    type: DOC_TYPES.IMG,
    title: "Site Photo",
    uri: "https://picsum.photos/800/500",
    meta: { width: 800, height: 500 },
  },
  {
    id: "5",
    type: DOC_TYPES.IMG,
    title: "Portrait Image",
    uri: "https://picsum.photos/700/1000",
    meta: { width: 700, height: 1000 },
  },
];
