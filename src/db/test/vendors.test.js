import vendors  from "../vendors/vendors";
import {
    expect,
    use
} from 'chai'

import {

} from "firebase/firestore";
import {resetDb} from "./resetDb";


jest.setTimeout(60 * 1000);
describe("Vendor test suite",  () => {
    beforeEach(async () => {
        await resetDb()
    })
    it('should add vendor', async () => {
        const vendor = await vendors.addVendor({
            name: "Armen",
            rfid: "hello",
            email: "armen@atlassian.com"
        })
        expect(vendor).to.not.be.undefined

        const vendorById = await vendors.getVendorById(vendor.uuid)

        expect(vendorById).to.not.be.null
        expect(vendorById.uuid).to.be.eq(vendor.uuid)

        const vendorByRfid = await vendors.getVendorByRFID("hello")
        expect(vendorByRfid).to.not.be.null
        expect(vendorByRfid.uuid).to.be.eq(vendor.uuid)

    });
    it('should have unique rfid', async () => {
        const vendorId = await vendors.addVendor({
            name: "Armen",
            rfid: "hello",
            email: "armen@atlassian.com"
        })
        await vendors.addVendor({
            name: "Armen",
            rfid: "hello",
            email: "armen@atlassian.com"
        }).then(val => {
            throw new Error('Duplicate rfid was not detected')
        }).catch(err => {
            expect(err.message).to.be.equal('Vendor with rfid "hello" already exists')
        })


    });
})

export { }