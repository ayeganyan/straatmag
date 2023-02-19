
export type VendorUUID = string

export type Rfid = string

export type Vendor = {
    uuid?: VendorUUID // Unique, non-null
    name: string // non-null
    rfid: Rfid // Unique, non-null
    email: string // optional
}