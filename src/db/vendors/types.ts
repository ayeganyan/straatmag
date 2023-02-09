
export type VendorUUID = string

export type RFID = string

export type Vendor = {
    uuid?: VendorUUID // Unique, non-null
    name: string // non-null
    rfid: RFID // Unique, non-null
    email: string // optional
}