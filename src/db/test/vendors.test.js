import vendors from '../vendors/vendors';
import { expect, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';

import {} from 'firebase/firestore';
import { resetDb } from './resetDb';

use(chaiAsPromised);

jest.setTimeout(60 * 1000);
describe('Vendor test suite', () => {
  beforeEach(async () => {
    await resetDb();
  });
  it('should add vendor', async () => {
    const vendor = await vendors.addVendor({
      name: 'Armen',
      rfid: 'hello',
      email: 'armen@atlassian.com',
    });
    expect(vendor).to.not.be.undefined;

    const vendorById = await vendors.getVendorById(vendor.uuid);

    expect(vendorById).to.not.be.null;
    expect(vendorById.uuid).to.be.eq(vendor.uuid);

    const vendorByRfid = await vendors.getVendorByRFID('hello');
    expect(vendorByRfid).to.not.be.null;
    expect(vendorByRfid.uuid).to.be.eq(vendor.uuid);
  });
  it('should have unique rfid', async () => {
    const vendorId = await vendors.addVendor({
      name: 'Armen',
      rfid: 'hello',
      email: 'armen@atlassian.com',
    });
    await expect(
      vendors.addVendor({
        name: 'Armen',
        rfid: 'hello',
        email: 'armen@atlassian.com',
      })
    ).to.eventually.be.rejectedWith(Error);
  });
  it('fields should not be blank', async () => {
    await expect(
      vendors.addVendor({
        name: '',
        rfid: 'hello',
        email: 'armen@atlassian.com',
      })
    ).to.eventually.be.rejectedWith(Error);

    await expect(
      vendors.addVendor({
        name: 'hello',
        rfid: '',
        email: 'armen@atlassian.com',
      })
    ).to.eventually.be.rejectedWith(Error);
  });
});

export {};
