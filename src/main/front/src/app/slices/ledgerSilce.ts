import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {LedgerType} from "../../TypeList";
import {Ledger} from "../../classes";
import {jsonHeader} from "../../headers";
import axios from "axios";

const initialState: { event: boolean , ledgerList : LedgerType[], ledger : LedgerType, ledgerItem : LedgerType[] ,status : string, error : string} = {
    event: false,
    ledgerList: [],
    ledger: {...new Ledger()},
    ledgerItem : [],
    status : "idle",
    error : ""
};


const ledgerSlice = createSlice({
    name: "ledger",
    initialState: initialState,
    reducers: {
        changeEvent: (state) => {
            state.event = !state.event;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(axiosGetLedger.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(axiosGetLedger.fulfilled,  (state, action) =>{
                state.status = "succeeded";
                state.ledgerList =  action.payload;

            })
            .addCase(axiosGetLedger.rejected, (state, action) => {
                state.status  = "falied";
                const message = action.error.message;
                if(message !== undefined ) state.error = message;
            })
            .addCase(axiosGetLedgerDetail.pending,(state, action) => {
                state.status = "loading";
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
            .addCase(axiosGetLedgerItem.pending, (state, action) => {
               state.status = "loading";
            })
            .addCase(axiosGetLedgerItem.fulfilled, ( state, action) => {
                state.status = "succeeded";
                state.ledgerItem = action.payload;
            })
            .addCase(axiosGetLedgerItem.rejected , (state, action) => {
                state.status = "failed";
                const message = action.error.message;
                if(message !== undefined ) state.error = message;
            })
    }
});


export const axiosGetLedger = createAsyncThunk(
    "ledger/axiosGetLedgerList",
    async (userNo : number) => {
        const res = await axios.post("/api/ledger/LedgerList", JSON.stringify({userNo}), jsonHeader);
        return res.data;
    }
)

export const axiosGetLedgerDetail = createAsyncThunk(
    "ledger/axiosGetLedgerDetail",
    async (ledgerNo : number) => {
        const res = await axios.post("/api/ledger/ledgerDetail", JSON.stringify({"fileOwnerNo" : ledgerNo}), jsonHeader);
        return res.data;
    }
)

export const axiosGetLedgerItem = createAsyncThunk(
    "ledger/axiosGetLedgerItem",
    async ({regDate, userNo} : {regDate : string, userNo : number}) => {
        const res = await axios.post("/api/ledger/ledgerItem", JSON.stringify({"regDate2" : regDate, "userNo" : userNo}), jsonHeader);
        return res.data;
    }
)

export const {changeEvent} = ledgerSlice.actions;
export default ledgerSlice.reducer;

