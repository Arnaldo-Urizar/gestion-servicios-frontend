export interface MeterChangeHistoryDto{
    idChange: number;
    idUser: number;
    oldMeterNumber: string;
    newMeterNumber: string;
    changeDate: string;
    notes: string;
}

// Crear y  actualizar historial
export interface MeterHistoryDto{
    idUser: number;
    oldMeterNumber: string;
    newMeterNumber: string;
    changeDate: string;
    notes: string;
}