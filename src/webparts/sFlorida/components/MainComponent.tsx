import * as React from "react";
import { useEffect, useState } from "react";
import { sp } from "@pnp/sp/presets/all";
import { Checkbox, FontWeights, Label } from "@fluentui/react";
import { Dropdown } from "@fluentui/react/lib/Dropdown";
import { Icon } from "@fluentui/react/lib/Icon";
import { ShimmeredDetailsList } from "@fluentui/react/lib/ShimmeredDetailsList";

import { DefaultButton, PrimaryButton } from "@fluentui/react/lib/Button";
import { SearchBox, ISearchBoxStyles } from "@fluentui/react/lib/SearchBox";
import { DetailsList, Selection, SelectionMode, Modal } from "@fluentui/react";
import { Panel } from "@fluentui/react/lib/Panel";
import { CommandBarButton, IconButton } from "@fluentui/react/lib/Button";
import { ITextFieldStyles, TextField } from "@fluentui/react/lib/TextField";
import {
  PeoplePicker,
  PrincipalType,
} from "@pnp/spfx-controls-react/lib/PeoplePicker";
import classes from "./SFlorida.module.scss";
import "./style.css";
import Pagination from "office-ui-fabric-react-pagination";
import { Spinner, SpinnerSize } from "@fluentui/react/lib/Spinner";
let DataArray: any[] = [];
let arrSecondary: any[] = [];
let isActive = false;
let listName = "S Florida Properties";
// let listName = "S Florida Dev";
interface Data {
  selected?: boolean;
  Title: string;
  Created: any;
  PropertyAddress: string;
  Whereat: string;
  AssignedTo: any;
  Status: string;
  Price: string;
  ARV: string;
  Offer: string;
  FinancingType: string;
  AgentName: string;
  OffMarket: boolean;
  Sold4: string;
  OfferContract: string;
  AgentNumber: string;
  Email: string;
  Name?: string;
  Notes: string;
  Modified: any;
  PeopleEmail: string;
  ID: any;
  assignId: number;
  attachments?: any[];
}
let attachFiles: any[] = [];
let files: any[] = [];
let totalPage: number = 30;
let currentPage = 1;
let objFilter = {
  user: "",
  property: "",
  sort: "newerToOlder",
};
const MainComponent = (props) => {
  const [masterData, setmasterdata] = useState<Data[]>([]);
  const [duplicate, setDuplicate] = useState<Data[]>([]);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState({
    Title: "",
    Price: "",
    ARV: "",
    Offer: "",
    Sold4: "",
  });
  const [select, setSelect] = useState(false);
  const [attachment, setAttachment] = useState([]);
  const [selectedSortingOption, setSelectedSortingOption] =
    useState("newerToOlder");

  const [isPane, setIsPane] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState(false);
  const [Id, setId] = useState(null);
  const [isdelete, setIsdelete] = useState(false);
  const [filterValue, setFilterValue] = useState(objFilter);
  // const [search,setSearch] = useState({
  //   name:"",
  //   email:"",
  //   PropertyAdd:""
  // });

  // const [crntPage, setCrntPage] = useState(1);
  const [rows, setrows] = useState(masterData);

  const [value, setvalue] = useState<Data>({
    Title: "",
    Created: null,
    PropertyAddress: "",
    Whereat: "",
    AssignedTo: null,
    Status: "",
    Price: "",
    ARV: "",
    Offer: "",
    FinancingType: "",
    AgentName: "",
    OffMarket: false,
    Sold4: "",
    OfferContract: "",
    AgentNumber: "",
    Email: "",
    Name: "",
    Notes: "",
    Modified: null,
    PeopleEmail: "",
    ID: null,
    assignId: null,
    attachments: [],
  });
  const [editdata, setEditdata] = useState<Data>({
    Title: "",
    Created: null,
    PropertyAddress: "",
    Whereat: "",
    AssignedTo: null,
    Status: "",
    Price: "",
    ARV: "",
    Offer: "",
    FinancingType: "",
    AgentName: "",
    OffMarket: false,
    Sold4: "",
    OfferContract: "",
    AgentNumber: "",
    Email: "",
    Notes: "",
    Modified: null,
    PeopleEmail: "",
    ID: null,
    assignId: null,
  });
  const [reRender, SetReRender] = useState(true);
  const searchstyle = {
    root: {
      width: 200,
    },
  };
  const buttonstyle = {
    root: {
      background: "#7a7574",
      color: "#fff",
      border: "1px solid #7a7574",
    },
    rootHovered: {
      backgroundColor: "#7a7574",
      color: "#fff",
    },
  };
  const columns = [
    {
      key: "Title",
      name: "MLS No./Off Market",
      fieldName: "Title",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
    },
    {
      key: "Originally Inputted",
      name: "Originally Inputted",
      fieldName: "Created",
      minWidth: 130,
      maxWidth: 200,
      isResizable: true,
    },
    {
      key: "Property Address",
      name: "Property Address",
      fieldName: "PropertyAddress",
      minWidth: 100,
      maxWidth: 150,
      isResizable: true,
    },
    {
      key: "Source",
      name: "Source",
      fieldName: "Whereat",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
    },
    {
      key: "Assigned To",
      name: "Assigned To",
      fieldName: "AssignedTo",
      minWidth: 120,
      maxWidth: 200,
      isResizable: true,
    },
    {
      key: "Status",
      name: "Status",
      fieldName: "Status",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
    },
    {
      key: "Price",
      name: "Price",
      fieldName: "Price",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
      onRender: (item: any) => {
        return item.Price ? `$${item.Price.toLocaleString("en-US")}` : "";
      },
    },
    {
      key: "ARV",
      name: "ARV",
      fieldName: "ARV",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
      onRender: (item: any) => {
        return item.ARV ? `$${item.ARV.toLocaleString("en-US")}` : "";
      },
    },
    {
      key: "Offer",
      name: "Offer ",
      fieldName: "Offer",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
      onRender: (item: any) => {
        return item.Offer ? `$${item.Offer.toLocaleString("en-US")}` : "";
      },
    },
    {
      key: "Buy Price",
      name: "Buy Price",
      fieldName: "OfferContract",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
    },
    {
      key: "Sold Price ",
      name: "Sold Price",
      fieldName: "Sold4",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
      onRender: (item: any) => {
        return item.Sold4 ? `$${item.Sold4.toLocaleString("en-US")}` : "";
      },
    },
    {
      key: "Agent Name ",
      name: "Agent Name ",
      fieldName: "AgentName",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
    },
    {
      key: "Agent Number",
      name: "Agent Number",
      fieldName: "AgentNumber",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
    },
    {
      key: "Email",
      name: "Agent Email",
      fieldName: "Email",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
    },
    {
      key: "OffMarket",
      name: "OffMarket ",
      fieldName: "OffMarket",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
    },
    {
      key: "Notes",
      name: "Notes",
      fieldName: "Notes",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
    },
    {
      key: "FinancingType",
      name: "Financing Type",
      fieldName: "FinancingType",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
    },
    {
      key: "attachments",
      name: "Offer Contract",
      fieldName: "attachments",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
      onRender: (item: any) => {
        return (
          <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
            {item.attachments.map((att, index) => (
              <li key={index}>
                <a
                  style={{ color: "#605E5C", cursor: "pointer" }}
                  href={att.serverRelativeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {att.fileName}
                </a>
              </li>
            ))}
          </ul>
        );
      },
    },

    {
      key: "column18",
      name: "Last Updated",
      fieldName: "Modified",
      minWidth: 130,
      maxWidth: 150,
      isResizable: true,
    },
  ];

  const modalheader = {
    root: {
      padding: "10px 5px",
    },
  };
  const textStyle = {
    field: {
      padding: "15x 6px !important",
      fontSize: "13px",
    },
    fieldGroup: {
      border: "none !important",
      background: "#faf8f9",
      borderRadius: "4px",

      "&:hover": {
        border: "1px solid #000 !important",
      },
    },
  };
  const labelstyle = {
    root: {
      fontSize: "12px",
      fontWeight: "600",
    },
  };
  const dollarInputStyle: Partial<ITextFieldStyles> = {
    root: {
      width: "100%",
    },
    field: {
      padding: "15x 6px !important",
      fontSize: "13px",
    },
    fieldGroup: {
      border: "1px solid #000 !important",
      backgroundColor: "#faf9f8",
      "::after": {
        border: "none",
      },
      "&:focus": {
        border: "2px solid #000 !important",
        borderWidth: "2px !important",
      },
    },
  };

  //sortFunction

  const sortFunction = (value) => {
    const sortedData = arrSecondary.slice().sort((a: any, b: any) => {
      const dateA = new Date(a.Created).getTime();
      const dateB = new Date(b.Created).getTime();
      if (!isNaN(dateA) && !isNaN(dateB)) {
        if (value === "newerToOlder") {
          return dateB - dateA;
        } else {
          return dateA - dateB;
        }
      }
    });
    setDuplicate([...sortedData]);
    let tempArr = sortedData;
    paginate(currentPage, [...tempArr]);
  };

  const selection = new Selection({
    onSelectionChanged: () => {
      const selectedItem: any = selection.getSelection()[0];

      if (selectedItem) {
        setId(selectedItem.ID);

        let _selectedItem = {
          Title: selectedItem.Title,
          Created: selectedItem.Created,
          PropertyAddress: selectedItem.PropertyAddress,
          Whereat: selectedItem.Whereat,
          AssignedTo: selectedItem.AssignedTo,
          Status: selectedItem.Status,
          Price: selectedItem.Price,
          ARV: selectedItem.ARV,
          Offer: selectedItem.Offer,
          FinancingType: selectedItem.FinancingType,
          AgentName: selectedItem.AgentName,
          OffMarket: selectedItem.OffMarket,
          Sold4: selectedItem.Sold4,
          OfferContract: selectedItem.OfferContract,
          AgentNumber: selectedItem.AgentNumber,
          Email: selectedItem.Email,
          Notes: selectedItem.Notes,
          Modified: selectedItem.Modified,
          PeopleEmail: selectedItem.AssignedTo,
          ID: selectedItem.ID,
          assignId: selectedItem.AssignedToId,
        };
        setEditdata({ ..._selectedItem });
        setSelect(true);
        // setvalue((prevValue) => ({ ...prevValue, selected: true }));
      } else {
        setSelect(false);
        // setvalue((prevValue) => ({ ...prevValue, selected: false }));
      }
      // console.log("Selected item:", value);
    },
  });

  function paginate(pagenumber: number, Data) {
    let allItems = Data;
    var lastIndex = pagenumber * totalPage;
    var firstIndex = lastIndex - totalPage;
    var paginatedItems = allItems.slice(firstIndex, lastIndex);
    // setCrntPage(pagenumber);
    currentPage = pagenumber;
    setrows(paginatedItems);
  }

  const getonChange = (key, _value) => {
    let FormData = { ...value };
    let newErrors = { ...error };
    FormData[key] = _value;

    if (
      key === "Price" ||
      key === "ARV" ||
      key === "Sold4" ||
      key === "Offer"
    ) {
      if (!/^\d*$/.test(_value)) {
        newErrors[key] = "Please enter a Number";
      } else {
        newErrors[key] = null;
      }
    }

    if (key === "Title") {
      const trimmedValue = _value.trim();
      if (trimmedValue === "") {
        newErrors[key] = "Title is required";
      } else {
        const titleExists = masterData.some((item) => {
          return (
            item.Title.toLowerCase().trim() === trimmedValue.toLowerCase() &&
            item.ID !== FormData.ID
          );
        });

        if (titleExists) {
          newErrors[key] = "This value already exists";
        } else {
          newErrors[key] = null;
        }
      }
    }

    setError({ ...newErrors });
    setvalue({ ...FormData });
  };

  const getFile = (e: any) => {
    files = e.target.files;
    // document.getElementById("att").focus();

    attachFiles = [...attachment];
    for (let i = 0; i < files.length; i++) {
      attachFiles.push({
        fileName: files[i].name,
        content: files[i],
        isNew: true,
        isDelete: false,
        serverRelativeUrl: "",
        itemId: value.ID,
      });
    }
    setAttachment([...attachFiles]);
    // console.log(attachment, "attach");
  };

  const updatevalue = () => {
    setIsEdit(false);

    setIsPane(false);
    setLoader(true);
    sp.web.lists
      .getByTitle(listName)
      .items.getById(Id)
      .update({
        Title: value.Title.trim(),
        AssignedToId: value.assignId,
        PropertyAddress: value.PropertyAddress,
        Price: parseInt(value.Price),
        ARV: parseInt(value.ARV),
        Offer: value.Offer,
        FinancingType: value.FinancingType,
        AgentName: value.AgentName,
        OffMarket: value.OffMarket,
        Sold4: value.Sold4,
        Whereat: value.Whereat,
        OfferContract: value.OfferContract,
        AgentNumber: value.AgentNumber,
        Email: value.Email,
        Notes: value.Notes,
        Status: value.Status,
      })
      .then(async (res) => {
        let todelete = attachment.filter((val) => {
          return val.isNew == false && val.isDelete == true;
        });
        let toadd = attachment.filter((val) => {
          return val.isNew == true && val.isDelete == false;
        });

        debugger;

        if (todelete.length > 0) {
          todelete.forEach((val, i) => {
            sp.web.lists
              .getByTitle(listName)
              .items.getById(Id)
              .attachmentFiles.getByName(val.fileName)
              .delete()
              .then((res) => {
                console.log(res);
                addDataAfterEdit(toadd, Id);
              })
              .catch((error) => {
                setLoader(false);
                console.log(error);
                console.log(`File not deleted : ${val.fileName}`);
              });
          });
        } else {
          addDataAfterEdit(toadd, Id);
        }

        // setIsPane(false);
        // SetReRender(true);
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
        // alert(err);
      });
  };

  async function addDataAfterEdit(data, Id) {
    if (data.length > 0) {
      let newData = data.map((val) => {
        return {
          name: val.fileName,
          content: val.content,
        };
      });

      sp.web.lists

        .getByTitle(listName)

        .items.getById(Id)

        .attachmentFiles.addMultiple(newData)
        .then((arr) => {
          getData();
        })
        .catch((err) => {
          setLoader(false);
          console.log(err);
        });
    } else {
      getData();
      // alert("Updated");
    }
    // alert("Updated");
  }

  const deleteData = () => {
    setLoader(true);
    setIsdelete(false);
    sp.web.lists
      .getByTitle(listName)
      .items.getById(Id)
      .delete()
      .then((res) => {
        // SetReRender(true);
        getData();
        setLoader(false);

        // alert("deleted successfully");
      })
      .catch((err) => {
        // alert(err);
      });
  };
  const onSave = async () => {
    setIsEdit(false);
    setIsPane(false);
    setLoader(true);

    if (value.Title == "") {
      setError({ ...error, Title: "Title is required" });
      setIsPane(true);
      return;
    }
    await sp.web.lists
      .getByTitle(listName)
      .items.add({
        Title: value.Title ? value.Title : "",
        AssignedToId: value.assignId !== undefined ? value.assignId : null,

        // Created: value.Created?value.Created:,
        PropertyAddress: value.PropertyAddress ? value.PropertyAddress : "",
        Whereat: value.Whereat ? value.Whereat : "",
        OfferContract: value.OfferContract ? value.OfferContract : "",

        Status: value.Status ? value.Status : "",
        Price: value.Price !== undefined ? parseInt(value.Price) : 0,
        ARV: value.ARV !== undefined ? parseInt(value.ARV) : 0,
        Offer:
          value.Offer !== undefined
            ? parseFloat(value.Offer.replace(/[^0-9.-]+/g, ""))
            : 0,
        FinancingType: value.FinancingType,
        AgentName: value.AgentName ? value.AgentName : "",
        OffMarket: value.OffMarket ? value.OffMarket : false,
        Sold4:
          value.Sold4 !== undefined
            ? parseFloat(value.Sold4.replace(/[^0-9.-]+/g, ""))
            : 0, // OfferContract: value.OfferContract,
        AgentNumber: value.AgentNumber ? value.AgentNumber : "",
        Email: value.Email ? value.Email : "",
        Notes: value.Notes ? value.Notes : "",

        // Modified: value.Modified,
        // PeopleEmail: value.PeopleEmail,
      })
      .then(async (res) => {
        let x = attachment.filter((a) => {
          return a.isDelete != true;
        });
        let countNew = 0;
        for (let i = 0; i < x.length; i++) {
          await sp.web.lists
            .getByTitle(listName)
            .items.getById(res.data.Id)
            .attachmentFiles.add(x[i].fileName, x[i].content)
            .then(async (res) => {
              countNew = countNew + 1;
              if (countNew >= x.length) {
                await getData();

                // SetReRender(true);
              }
              // setIsPane(false);
            })
            .catch((err) => {
              console.log(err);
            });
        }

        // sp.web.lists
        //   .getByTitle(listName)
        //   .items.getById(res.data.Id)
        //   .attachmentFiles.addMultiple(
        //     x.map((val) => {
        //       return {
        //         name: val.fileName,
        //         content: val.content,
        //       };
        //     })
        //   )
        //   .then((res) => {
        //     console.log("success");
        //     console.log(res, "res");
        //     setAttachment([]);
        //     alert("Created")
        //     // getData()
        //   })
        //   .catch((err) => {
        //     console.log(err);
        //   });

        value.ARV = "";
        value.AgentName = "";
        value.AgentNumber = "";
        value.AssignedTo = null;
        value.Email = "";
        value.Notes = "";
        value.Title = "";
        value.OffMarket = false;
        value.Price = "";
        value.Sold4 = "";
        value.Offer = "";
        value.PropertyAddress = "";
        value.Whereat = "";
        value.Status = "";
        setvalue({ ...value });
        // setIsPane(false);
        getData();
        setLoader(false);
        // SetReRender(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getData = async () => {
    await sp.web.lists
      .getByTitle(listName)
      .items.select("*, AssignedTo/EMail,AssignedTo/Title,AttachmentFiles")
      .expand("AssignedTo", "AttachmentFiles")
      .top(5000)
      .orderBy("Created", false)
      .get()
      .then(async (res: any) => {
        console.log(res);

        DataArray = [];
        res.forEach((li) => {
          let arrGetAttach = [];
          li.AttachmentFiles.forEach((val) => {
            arrGetAttach.push({
              fileName: val.FileName,
              content: null,
              isNew: false,
              isDelete: false,
              serverRelativeUrl: val.ServerRelativeUrl,
              itemId: value.ID,
            });
          });
          DataArray.push({
            Title: li.Title ? li.Title : "",
            // Created: res[i].Created,
            PropertyAddress: li.PropertyAddress ? li.PropertyAddress : "",
            Whereat: li.Whereat,
            AssignedTo: li.AssignedTo ? li.AssignedTo.EMail : "",
            Created: li.Created,
            Status: li.Status,
            Price: li.Price,
            ARV: li.ARV,
            Offer: li.Offer,
            AgentName: li.AgentName,
            OffMarket: li.OffMarket,
            Sold4: li.Sold4,
            OfferContract: li.OfferContract,
            AgentNumber: li.AgentNumber,
            FinancingType: li.FinancingType,
            Email: li.Email,
            Name: li.AssignedTo?.Title ? li.AssignedTo?.Title : "",
            Notes: li.Notes,
            Modified: li.Modified,
            ID: li.ID,
            PeopleEmail: li.AssignedTo ? li.AssignedTo.EMail : "",
            assignId: li.AssignedToId ? li.AssignedToId : null,
            attachments: arrGetAttach,
          });
        });
        arrSecondary = [...DataArray];
        setmasterdata([...DataArray]);
        setDuplicate([...DataArray]);
        paginate(1, [...DataArray]);
        setLoader(false);
        isActive = true;
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const GetAddachment = () => {
    let getattach = [];
    let objSectedData = masterData.filter((li) => li.ID == editdata.ID)[0];
    objSectedData.attachments.forEach((val) => {
      getattach.push({
        fileName: val.fileName,
        content: null,
        isNew: false,
        isDelete: false,
        serverRelativeUrl: val.ServerRelativeUrl,
        itemId: value.ID,
      });
    });
    setAttachment([...getattach]);
  };
  const calcelAttach = (index) => {
    let temp = [...attachment];
    if (temp[index].isNew) {
      temp.splice(index, 1);
    } else {
      temp[index].isDelete = true;
    }
    setAttachment([...temp]);
  };

  const handleSearch = (val) => {
    console.log(val);
    let filteredResults = masterData.filter((item) =>
      val.property != ""
        ? item.PropertyAddress.toLowerCase().includes(
            val.property.trim().toLowerCase()
          )
        : item
    );
    filteredResults = filteredResults.filter((li) =>
      val.user.trim() != ""
        ? li.Name.toLowerCase().includes(val.user.trim().toLowerCase()) ||
          li.PeopleEmail.toLowerCase().includes(val.user.trim().toLowerCase())
        : li
    );
    console.log(filteredResults);
    arrSecondary = filteredResults;
    setDuplicate([...filteredResults]);
    sortFunction(objFilter.sort);
    // paginate(1, [...filteredResults]);
  };
  useEffect(() => {
    setLoader(true);
    getData();
  }, []);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Label
            styles={{
              root: {
                fontSize: "16px",
                FontWeights: "700",
                padding: 0,
              },
            }}
          >
            S Florida Properties
          </Label>
          {/* <Icon iconName="FavoriteStar" /> */}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Label>Orginally inputted :</Label>
            <Dropdown
              styles={{
                root: {
                  width: 200,
                },
              }}
              defaultSelectedKey={selectedSortingOption}
              options={[
                { key: "newerToOlder", text: "Newer to Older" },
                { key: "olderToNewer", text: "Older to Newer" },
              ]}
              onChange={(e, val) => {
                setSelectedSortingOption(val.key as string);
                objFilter.sort = val.key as string;
                handleSearch(objFilter);
              }}
            />
          </div>
          <SearchBox
            placeholder="Search Assigned To"
            styles={searchstyle}
            onChange={(_, newValue) => {
              objFilter.user = newValue;
              handleSearch(objFilter);
            }}
            onClick={() => {
              handleSearch(objFilter);
            }}
          />

          <SearchBox
            placeholder="Search Property Address"
            styles={searchstyle}
            onChange={(_, newValue) => {
              objFilter.property = newValue;
              handleSearch(objFilter);
            }}
            onClick={() => {
              handleSearch(objFilter);
            }}
            // onSearch={(val) => {}}
          />
          <DefaultButton
            text="New"
            // disabled={!isActive}
            iconProps={{ iconName: "Add" }}
            styles={buttonstyle}
            onClick={() => {
              setIsPane(true);
              let tempObj: Data = {
                Title: "",
                Created: null,
                PropertyAddress: "",
                Whereat: "",
                AssignedTo: null,
                Status: "",
                Price: "",
                ARV: "",
                Offer: "",
                FinancingType: "",
                AgentName: "",
                OffMarket: false,
                Sold4: "",
                OfferContract: "",
                AgentNumber: "",
                Email: "",
                Notes: "",
                Modified: null,
                PeopleEmail: "",
                ID: null,
                assignId: null,
              };
              setvalue(tempObj);
              setAttachment([]);
              setIsEdit(false);
              // setSelect(false);
              // setvalue({ ...value });
            }}
          />
          {select && (
            <>
              <DefaultButton
                text="Edit"
                iconProps={{ iconName: "Edit" }}
                // styles={buttonstyle}

                styles={{
                  root: {
                    border: "none", // Remove the border
                  },
                }}
                onClick={(e: any) => {
                  setIsEdit(true);

                  setIsPane(true);
                  setvalue({ ...editdata });
                  GetAddachment();
                }}
              />

              <IconButton
                // text="Delete"
                title="Delete"
                iconProps={{ iconName: "Delete" }}
                // styles={buttonstyle}
                styles={{
                  root: {
                    color: "#FF6347",
                  },
                  rootHovered: {
                    color: "#FF6347",
                  },
                }}
                onClick={(e: any) => {
                  // deleteData();
                  setIsdelete(true);
                  setIsPane(false);
                }}
              />
            </>
          )}
        </div>
      </div>
      <div>
        {loader ? (
          <ShimmeredDetailsList
            setKey="items"
            items={[]}
            columns={columns}
            enableShimmer={true}
            // shimmerLines={10}
          />
        ) : rows.length === 0 ? (
          <Label
            styles={{
              root: {
                fontSize: "16px",
                fontWeight: "bold",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "50px 0px",
              },
            }}
          >
            No Data Found
          </Label>
        ) : (
          <DetailsList
            items={rows}
            columns={columns}
            selection={selection}
            selectionMode={SelectionMode.single}
            onShouldVirtualize={() => {
              return false;
            }}
          />
        )}
        {rows.length > 0 || loader ? (
          <Pagination
            currentPage={currentPage}
            totalPages={
              duplicate.length > 0 ? Math.ceil(duplicate.length / 30) : 1
            }
            onChange={(page) => {
              paginate(page, duplicate);
            }}
            // style={{ margin: "auto" }}
          />
        ) : (
          ""
        )}
        {/* {masterData.length > 0 ? (
          <DetailsList
            items={masterData}
            columns={columns}
            selection={selection}
            selectionMode={SelectionMode.single}
            onShouldVirtualize={() => {
              return false;
            }}
            // setKey="set"
            // onItemInvoked={() => deselectSelectedItem()}
          />
        ) : (
          <></>
        )} */}
      </div>
      {/* 
      <ShimmeredDetailsList
        items={masterData} // Empty items array when loading
        columns={columns}
        enableShimmer={!masterData}
        selection={selection}
        selectionMode={SelectionMode.single}
        onShouldVirtualize={() => {
          return false;
        }} */}

      {/* /> */}
      {/* panel */}
      {isPane && (
        <Panel
          isOpen={true}
          styles={{
            main: {
              width: "50% !important",
            },
          }}
        >
          {/* <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0 20px",
              borderBottom: "1px solid gray",
            }}
           >
            <div>
              <CommandBarButton
                iconProps={{ iconName: "Save" }}
                text="Save"
                title="Save"
                styles={modalheader}
                // style={{ padding: "10px 5px" }}
              />
              <CommandBarButton
                iconProps={{ iconName: "cancel" }}
                text="Cancel"
                title="Cancel"
                styles={modalheader}
                // style={{ padding: "10px 5px" }}
              />
              <CommandBarButton
                iconProps={{ iconName: "Link" }}
                text="Copy Link"
                styles={modalheader}
                // style={{ padding: "10px 5px" }}
              />
            </div>
            <div>
              <IconButton
                iconProps={{ iconName: "Edit" }}
                  menuProps={menuProps}
                styles={{
                  root: {
                    ".ms-Button-flexContainer": {
                      paddingRight: "15px",
                    },
                  },
                }}
              />
              <IconButton
                iconProps={{ iconName: "cancel" }}
                title="Close"
                  onClick={() => setPanel(false)}
              />
            </div>
          </div> */}
          {/* title */}
          <div>
            <div
              style={{
                // borderBottom: "1px solid gray",
                padding: "5px 0px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "15px",
              }}
            >
              <h3 style={{ fontSize: "16px", fontWeight: "bolder", margin: 0 }}>
                New item
              </h3>
              <IconButton
                iconProps={{ iconName: "cancel" }}
                title="Close"
                onClick={() => {
                  setIsPane(false);
                  setError({
                    Title: "",
                    Price: "",
                    ARV: "",
                    Offer: "",
                    Sold4: "",
                  });
                }}
              />
            </div>
            {/* TextField */}

            <div style={{ margin: "10px 0px 15px 0px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Icon iconName="TextField" style={{ marginRight: "10px" }} />

                <Label required styles={labelstyle}>
                  MLS No./Off Market
                </Label>
              </div>

              <TextField
                styles={textStyle}
                placeholder="Please enter value here"
                value={value.Title}
                // id="Email"
                // name="Email"
                errorMessage={error.Title ? error.Title : ""}
                onChange={(e, val) => {
                  getonChange("Title", val);
                }}
              />
            </div>
            <div style={{ margin: "10px 0px 15px 0px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Icon iconName="TextField" style={{ marginRight: "10px" }} />
                <Label styles={labelstyle}>Property Address</Label>
              </div>

              <TextField
                styles={textStyle}
                placeholder="Please enter address here"
                value={value.PropertyAddress}
                id="property"
                name="property"
                onChange={(e, val) => {
                  getonChange("PropertyAddress", val);
                }}
              />
            </div>
            <div style={{ margin: "10px 0px 15px 0px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Icon iconName="KaizalaLogo" style={{ marginRight: "10px" }} />
                <Label styles={labelstyle}>Source</Label>
              </div>

              <Dropdown
                placeholder="Select an option"
                // label="Technologies"
                defaultSelectedKey={value.Whereat}
                options={[
                  {
                    key: "MLS O Days",
                    text: "MLS O Days",
                  },

                  {
                    key: "Deep Dive",
                    text: "Deep Dive",
                  },
                  {
                    key: "OffMarket/Wholesale",
                    text: "OffMarket/Wholesale",
                  },
                  {
                    key: "Pocket Listing",
                    text: "Pocket Listing",
                  },
                  {
                    key: "FSBO",
                    text: "FSBO",
                  },
                  {
                    key: "Pack on Market",
                    text: "Pack on Market",
                  },
                  {
                    key: "Price Drop",
                    text: "Price Drop",
                  },
                  {
                    key: "Browardbuyers.com",
                    text: "Browardbuyers.com",
                  },
                  {
                    key: "Email Blast",
                    text: "Email Blast",
                  },
                  {
                    key: "Plot Point",
                    text: "Plot Point",
                  },
                ]}
                onChange={(e, val) => {
                  getonChange("Whereat", val.key);
                }}
              />
            </div>
            <div style={{ margin: "10px 0px 15px 0px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Icon iconName="Contact" style={{ marginRight: "10px" }} />
                <Label styles={labelstyle}>Assigned To</Label>
              </div>

              <PeoplePicker
                context={props.context}
                personSelectionLimit={1}
                groupName={""}
                showtooltip={true}
                // required={true}
                ensureUser={true}
                // showHiddenInUI={false}
                showHiddenInUI={true}
                principalTypes={[PrincipalType.User]}
                defaultSelectedUsers={
                  value.PeopleEmail ? [value.PeopleEmail] : []
                }
                // defaultSelectedUsers={["Chandru@palmcactus.com"]}
                resolveDelay={1000}
                onChange={(items: any[]) => {
                  if (items.length > 0) {
                    const selectedItem = items[0];
                    getonChange("assignId", selectedItem.id);
                    // getonChange("PeopleEmail", selectedItem.secondaryText);
                  } else {
                    // No selection, pass null or handle as needed
                    getonChange("assignId", null);
                  }
                }}
              />
            </div>
            <div style={{ margin: "10px 0px 15px 0px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Icon iconName="KaizalaLogo" style={{ marginRight: "10px" }} />
                <Label styles={labelstyle}>Status</Label>
              </div>
              <Dropdown
                // label="Technologies"
                // defaultSelectedKey={value.Status}
                defaultSelectedKey={value.Status}
                onChange={(e, val) => {
                  getonChange("Status", val.key);
                }}
                options={[
                  { key: "Coming Soon", text: "Coming Soon" },
                  { key: "Active", text: "Active" },
                  {
                    key: "Active/Under Contract",
                    text: "Active/Under Contract",
                  },
                  { key: "Pending", text: "Pending" },
                  { key: "Closed", text: "Closed" },
                  { key: "PC Closed", text: "PC Closed" },
                  { key: "Temp Off Market", text: "Temp Off Market" },
                  // Add more options as needed
                ]}
                // placeholder="Select an option"
                // defaultSelectedKey={value.Status}
              />
            </div>

            <div style={{ margin: "10px 0px 15px 0px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Icon iconName="AddTo" style={{ marginRight: "10px" }} />
                <Label styles={labelstyle}>Price</Label>
              </div>

              {/* <div className={classes.dollarInput}>
                <span>$</span> */}
              <TextField
                prefix="$"
                styles={dollarInputStyle}
                placeholder="Enter a number"
                errorMessage={error.Price ? error.Price : null}
                value={value.Price}
                onChange={(e, val) => {
                  getonChange("Price", val);
                }}
              />
              {/* </div> */}
            </div>

            {/* dollar textfield */}
            <div style={{ margin: "10px 0px 15px 0px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Icon iconName="AddTo" style={{ marginRight: "10px" }} />
                <Label styles={labelstyle}>ARV</Label>
              </div>

              {/* <div className={classes.dollarInput}> */}
              {/* <span>$</span> */}
              <TextField
                type="text"
                prefix="$"
                value={value.ARV}
                styles={dollarInputStyle}
                errorMessage={error.ARV ? error.ARV : null}
                placeholder="Enter a number"
                onChange={(e, val) => {
                  getonChange("ARV", val);
                }}
              />
              {/* </div> */}
              {/* {error&& <Label></Label>} */}
            </div>

            <div style={{ margin: "10px 0px 15px 0px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Icon iconName="TextField" style={{ marginRight: "10px" }} />
                <Label styles={labelstyle}>Offer</Label>
              </div>

              <TextField
                styles={dollarInputStyle}
                prefix="$"
                placeholder="Please enter Offer here"
                errorMessage={error.Offer ? error.Offer : null}
                value={value.Offer}
                id="offer"
                name="offer"
                onChange={(e, val) => {
                  getonChange("Offer", val);
                }}
              />
            </div>
            <div style={{ margin: "10px 0px 15px 0px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Icon iconName="TextField" style={{ marginRight: "10px" }} />
                <Label styles={labelstyle}>Buy Price</Label>
              </div>

              <TextField
                styles={textStyle}
                placeholder="Please enter Offer here"
                value={value.OfferContract}
                // id="Sold 4"
                // name="Sold 4"
                onChange={(e, val) => {
                  getonChange("OfferContract", val);
                }}
              />
            </div>
            <div style={{ margin: "10px 0px 15px 0px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Icon iconName="TextField" style={{ marginRight: "10px" }} />
                <Label styles={labelstyle}>Sold Price</Label>
              </div>

              <TextField
                styles={textStyle}
                placeholder="Please enter Offer here"
                value={value.Sold4}
                errorMessage={error.Sold4 ? error.Sold4 : null}
                id="Sold Price"
                name="Sold Price"
                onChange={(e, val) => {
                  getonChange("Sold4", val);
                }}
              />
            </div>

            <div style={{ margin: "10px 0px 15px 0px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Icon iconName="TextField" style={{ marginRight: "10px" }} />
                <Label styles={labelstyle}>Agent Name</Label>
              </div>

              <TextField
                styles={textStyle}
                placeholder="Please enter Offer here"
                value={value.AgentName}
                // id="Sold 4"
                // name="Sold 4"
                onChange={(e, val) => {
                  getonChange("AgentName", val);
                }}
              />
            </div>

            <div style={{ margin: "10px 0px 15px 0px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Icon iconName="TextField" style={{ marginRight: "10px" }} />
                <Label styles={labelstyle}>Agent Number</Label>
              </div>

              <TextField
                styles={textStyle}
                placeholder="Please enter Offer here"
                value={value.AgentNumber}
                // id="Sold 4"
                // name="Sold 4"
                onChange={(e, val) => {
                  getonChange("AgentNumber", val);
                }}
              />
            </div>
            <div style={{ margin: "10px 0px 15px 0px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Icon iconName="TextField" style={{ marginRight: "10px" }} />
                <Label styles={labelstyle}>Agent Email</Label>
              </div>

              <TextField
                styles={textStyle}
                placeholder="Please enter Offer here"
                value={value.Email}
                // id="Sold 4"
                // name="Sold 4"
                onChange={(e, val) => {
                  getonChange("Email", val);
                }}
              />
            </div>
            <div style={{ margin: "10px 0px 15px 0px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Icon
                  iconName="TransitionPush"
                  style={{ marginRight: "10px" }}
                />
                <Label styles={labelstyle}>Offer Market</Label>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "5px",
                  // border: "1px solid #000",
                  background: "##faf8f9",
                }}
              >
                <Checkbox
                  label="Yes"
                  checked={value.OffMarket}
                  onChange={(e, val) => {
                    getonChange("OffMarket", val);
                  }}
                />
              </div>
            </div>
            <div style={{ margin: "10px 0px 15px 0px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Icon iconName="ListMirrored" style={{ marginRight: "10px" }} />
                <Label styles={labelstyle}>Notes</Label>
              </div>

              <TextField
                styles={textStyle}
                placeholder="Please enter Offer here"
                value={value.Notes}
                // id="Sold 4"
                // name="Sold 4"
                onChange={(e, val) => {
                  getonChange("Notes", val);
                }}
                multiline
                rows={5}
              />
            </div>

            <div style={{ margin: "10px 0px 15px 0px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Icon iconName="KaizalaLogo" style={{ marginRight: "10px" }} />
                <Label styles={labelstyle}>Financing Type</Label>
              </div>

              <Dropdown
                placeholder="Select an option"
                // label="Technologies"
                defaultSelectedKey={value.FinancingType}
                options={[
                  {
                    key: "Cash",
                    text: "Cash",
                  },

                  {
                    key: "Private Money",
                    text: "Private Money",
                  },
                  {
                    key: "Hard Money",
                    text: "Hard Money",
                  },
                  {
                    key: "Conventional",
                    text: "Conventional",
                  },
                ]}
                onChange={(e, val) => {
                  getonChange("FinancingType", val.key);
                }}
              />
            </div>

            <div style={{ margin: "10px 0px 15px 0px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Icon iconName="Attach" style={{ marginRight: "10px" }} />
                <Label styles={labelstyle}>Offer Contract</Label>
              </div>
              {attachment.length > 0 &&
                attachment.map((val, index) => {
                  if (val.isDelete == false) {
                    return (
                      <div style={{ display: "flex", gap: "10px" }}>
                        <Label>{val.fileName}</Label>
                        <IconButton
                          iconProps={{ iconName: "cancel" }}
                          onClick={() => calcelAttach(index)}
                        />
                      </div>
                    );
                  }
                  // console.log(val.FileName);
                })}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "5px",
                  border: "1px solid #cccc",
                  background: "##faf8f9",
                }}
              >
                <input
                  type="file"
                  id="att"
                  style={{ display: "none" }}
                  // onChange={getFile}
                  onChange={(e: any) => {
                    e.preventDefault();
                    getFile(e);
                  }}
                  multiple
                />
                <Label
                  htmlFor="att"
                  styles={{
                    root: {
                      fontSize: "14px",
                      cursor: "pointer",
                      selectors: {
                        ":hover": {
                          textDecoration: "underline",
                        },
                      },
                    },
                  }}
                >
                  Click here to add attachments
                </Label>
              </div>
            </div>

            <div style={{ marginTop: "25px", display: "flex", gap: "15px" }}>
              <PrimaryButton
                onClick={() => {
                  isEdit ? updatevalue() : onSave();

                  // setIsEdit(false);
                }}
                disabled={
                  !value.Title.trim() ||
                  error.ARV ||
                  error.Price ||
                  error.Sold4 ||
                  error.Offer
                    ? true
                    : false
                }
                text={isEdit ? "Update" : "Save"}
                styles={{
                  root: {
                    borderRadius: "4px",
                    backgroundColor: "#7a7574",
                    color: "#fff",
                  },
                  rootHovered: {
                    backgroundColor: "#7a7574",
                    color: "#fff",
                  },
                }}
              />
              <DefaultButton
                onClick={() => {
                  setIsPane(false);
                  setError({
                    Title: "",
                    Price: "",
                    ARV: "",
                    Offer: "",
                    Sold4: "",
                  });
                }}
                text="Cancel"
                styles={{
                  root: {
                    borderRadius: "4px",
                  },
                }}
              />
            </div>
          </div>
        </Panel>
      )}
      <Modal
        isOpen={isdelete}
        // onDismiss={false}
        styles={{
          main: {
            width: "28%",
            // height: 150,
            padding: 20,
          },
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h4 style={{ margin: 0 }}>Delete?</h4>
          <IconButton
            iconProps={{ iconName: "cancel" }}
            onClick={() => setIsdelete(false)}
          />
        </div>
        <p
          style={{
            marginTop: "20px",
            fontSize: "14px",
            // textAlign: "center",
            color: "rgb(96, 94, 92)",
          }}
        >
          Are you sure want to send this item to the recycle bin?...
        </p>
        <div
          style={{
            marginTop: "40px",
            display: "flex",
            justifyContent: "end",
            gap: "20px",
            alignItems: "center",
          }}
        >
          <PrimaryButton
            text="Delete"
            onClick={() => {
              deleteData();
            }}
            styles={{
              root: {
                color: "white",
                width: 90,
                height: 30,
                padding: "5px 10px",
              },
            }}
          />
          <DefaultButton
            text="Cancel"
            onClick={() => {
              setIsdelete(false);
            }}
            styles={{
              root: {
                // backgroundColor: "red",
                color: "#000",
                width: 90,
                height: 30,
                padding: "5px 10px",
              },
            }}
          />
        </div>
      </Modal>
    </div>
  );
};
export default MainComponent;
