export const heightOptions: SelectOption[] = [
    { value: 58, label: `4' 10"` },
    { value: 59, label: `4' 11"` },
    { value: 60, label: `5' 0"` },
    { value: 61, label: `5' 1"` },
    { value: 62, label: `5' 2"` },
    { value: 63, label: `5' 3"` },
    { value: 64, label: `5' 4"` },
    { value: 65, label: `5' 5"` },
    { value: 66, label: `5' 6"` },
    { value: 67, label: `5' 7"` },
    { value: 68, label: `5' 8"` },
    { value: 69, label: `5' 9"` },
    { value: 70, label: `5' 10"` },
    { value: 71, label: `5' 11"` },
    { value: 72, label: `6' 0"` },
    { value: 73, label: `6' 1"` },
    { value: 74, label: `6' 2"` },
    { value: 75, label: `6' 3"` },
    { value: 76, label: `6' 4"` },
    { value: 77, label: `6' 5"` }
];

export const priceOptions: SelectOption[] = [
    { value: 100, label: `$100` },
    { value: 250, label: `$250` },
    { value: 500, label: `$500` },
    { value: 1000, label: `$1000` },
    { value: 2500, label: `$2500` },
    { value: 5000, label: `$5000` },
    { value: 10000, label: `$10000` }
]

export const SideEffectOptions: SelectOption[] = [
    { value: 0, label: `Nausea` },
    { value: 1, label: `Vomiting` },
    { value: 2, label: `Diarrhea` },
    { value: 3, label: `Hypoglycemia` }
]

export interface Medication {
    OfficialName: string,
    TradeName: string,
}

export const MedicationOptions: Medication[] = [
    { OfficialName: "Semaglutide", TradeName: "Ozempic" },
    { OfficialName: "Dulaglutide", TradeName: "Trulicity" },
    { OfficialName: "Liraglutide", TradeName: "Victoza" },
    { OfficialName: "Exenatide", TradeName: "Byetta" },
]

export const MedicationToTradeName: { [key: string]: string; } = {
    "Semaglutide": "Ozempic",
    "Dulaglutide": "Trulicity",
    "Liraglutide": "Victoza",
    "Exenatide": "Byetta"
}

export interface LoginCredentialsDTO {
    email: string,
    password: string
}

export interface NewUserDTO {
    username: string,
    email: string,
    password: string
    firstname?: string,
    lastname?: string
}

export interface Post {
    _id: string,
    weightLost: number,
    medicationUsed: string,
    caption: string,
    beforeImageUrl: string,
    afterImageUrl: string
    beforeImageId: string,
    afterImageId: string,
    createdAt: string,
    userId: string,
    userDetails?: {
        username: string
    },
    paginationToken?: string
}

export interface PostDetailsDTO {
    weightLost: number,
    medicationUsed: string,
    caption: string
}

export interface ReviewData {
    _id?: string,
    rating: number,
    medication: string,
    sideEffects: string[],
    reviewBody: string,
    createdAt: string,
    userDetails?: { username: string }
}

export interface NewReviewDTO {
    rating: number,
    medicationUsed: SelectOption,
    sideEffects: any,
    reviewBody: string
}

export type SelectOption = {
    value: number,
    label: string
}

export const parseBlurHash = (filename: string) => {
    return filename.split('>')[0];
}

export const medicationOptions = MedicationOptions.map((opt, index) => { return { label: `${opt.OfficialName} (${opt.TradeName})`, value: index } })

export const getDateString = (date: string) => {
    const postDate = new Date(date);
    return `${postDate.getMonth() + 1}/${postDate.getDate()}/${postDate.getFullYear()}`
}