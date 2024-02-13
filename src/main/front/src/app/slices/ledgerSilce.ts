import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {LedgerType} from "../../TypeList";
import {Ledger} from "../../classes";
import {jsonHeader} from "../../headers";
import axios from "customFunction/customAxios";
import Swal from "sweetalert2";

interface LedgerData {
    [key: string]: any[]; // 모든 종류의 배열을 값으로 갖는 객체
}

const initialState: {
    event: boolean;
    ledgerList: LedgerData;
    ledger: LedgerType;
    ledgerItem: LedgerType[];
    selectButton : number;
    status: string;
    error: string;
} = {
    event: false,
    ledgerList: {},  // 빈 객체로 초기화
    ledger: { ...new Ledger() },
    ledgerItem: [],
    selectButton : 1,
    status: "idle",
    error: ""
};


const ledgerSlice = createSlice({
    name: "ledger",
    initialState: initialState,
    reducers: {
        changeEvent: (state) => {
            state.event = !state.event;
        },
        ChangeSelectButton: (state, action) => {
            state.selectButton = action.payload;
        }
    },
    extraReducers(builder) {
        builder
            .addCase(axiosGetLedgerAllDay.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(axiosGetLedgerAllDay.fulfilled,  (state, action) =>{
                state.status = "succeeded";
                state.ledgerList =  action.payload;
            })
            .addCase(axiosGetLedgerAllDay.rejected, (state, action) => {
                state.status  = "failed";
                const message = action.error.message;
                if(message !== undefined ) state.error = message;
            })
            .addCase(axiosGetLedgerDetail.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.ledger = {...state.ledgerItem, ...action.payload};
            })
            .addCase(axiosGetLedgerDetail.rejected, (state, action) => {
                state.status = "failed";
                const message = action.error.message;
                if(message !== undefined ) state.error = message;
            })
            .addCase(axiosDeleteLedger.fulfilled, (state , action) => {
                state.status = "succeeded";
            })
            .addCase(axiosDeleteFile.fulfilled, (state, action) => {
                state.status = "succeeded";
                Swal.fire({
                    icon : "success",
                    title : "삭제되었습니다.",
                    timer : 2000
                })
            })
            .addCase(axiosDeleteFileItem.fulfilled, (state, action) => {
                state.status = "succeeded";
                Swal.fire({
                    icon : "success",
                    title : "삭제되었습니다.",
                    timer : 2000
                })
            })

    }
});

export const axiosGetLedgerAllDay = createAsyncThunk(
    "ledger/axiosGetLedgerAllDay",
    async ({userNo, searchKey} : { userNo : number , searchKey : string}) => {
        const res = await axios.post("/api/ledger/LedgerAllDayList", JSON.stringify({"userNo" : userNo, "searchKey" : searchKey}));
        return res.data;
    }
)

export const axiosGetLedgerDetail = createAsyncThunk(
    "ledger/axiosGetLedgerDetail",
    async (ledgerNo : number) => {
        const res = await axios.post("/api/ledger/ledgerDetail", JSON.stringify({"fileOwnerNo" : ledgerNo}));
        return res.data;
    }
)
export const axiosDeleteLedger = createAsyncThunk(
    "ledger/axiosDeleteLedger",
    async (ledgerNo : number) => {
        const res = await axios.post("/api/ledger/ledgerDelete", JSON.stringify({"fileOwnerNo" : ledgerNo}));
        return res.data
    }
)

export const axiosDeleteFile = createAsyncThunk(
    "ledger/deleteFile",
    async (fileOwnerNo : number) => {
        const res = await axios.post("/api/ledger/deleteFile", JSON.stringify({"fileOwnerNo" : fileOwnerNo}));
        return res.data;
    }
);

export const axiosFileUpload = createAsyncThunk(
    "ledger/fileUpload",
    async (file : FormData) => {
        const res = await axios.formData("/api/ledger/uploadFile", file);
        return res.data;
    }
)

export const axiosDeleteFileItem = createAsyncThunk(
    "ledger/deleteFileItem",
    async (checkedList : number[]) => {
        const res = await axios.post("/api/ledger/deleteFileItem", checkedList);
        return res.data;
    }
)




export const {changeEvent, ChangeSelectButton} = ledgerSlice.actions;
export default ledgerSlice.reducer;
