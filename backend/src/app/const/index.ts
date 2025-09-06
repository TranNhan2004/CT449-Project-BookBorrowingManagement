import { RankEnum } from "../enum/index"
import { IRankInfo } from "../types/user"

export const rankInfo: Record<RankEnum, IRankInfo> = {
    [RankEnum.Basic]: {
        minPoints: 1,
        maxExtensionDays: 5,
        maxReservationDays: 5
    },
    [RankEnum.Bronze]: {
        minPoints: 21,
        maxExtensionDays: 6,
        maxReservationDays: 5
    },
    [RankEnum.Silver]: {
        minPoints: 101,
        maxExtensionDays: 7,
        maxReservationDays: 6
    },
    [RankEnum.Gold]: {
        minPoints: 251,
        maxExtensionDays: 8,
        maxReservationDays: 6
    },
    [RankEnum.Platinum]: {
        minPoints: 601,
        maxExtensionDays: 9,
        maxReservationDays: 7
    },
    [RankEnum.Diamond]: {
        minPoints: 1501,
        maxExtensionDays: 10,
        maxReservationDays: 7
    }
}


export const pattern = {
    phone: /^[0-9]+$/,
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/,
}
