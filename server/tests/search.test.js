const request = require('supertest');
const app = require('../server');

describe('medication search using incorrect spelling', () => {
  it('should find "LIPITOR" and associated genericNames using incorrect spelling => "lipitore"', async (done) => {
    const res = await request(app)
      .get('/api/search/')
      .query({ q: 'lipitore' });

    const { body } = res;
    const brandName = body.filter(name => name.b === 'LIPITOR');
    const genericName = body.filter(name => name.g === 'ATORVASTATIN CALCIUM');

    expect(brandName.length).toBeGreaterThan(1);
    expect(brandName.length).toBeLessThan(5);
    expect(genericName.length).toBeGreaterThan(1);
    expect(genericName.length).toBeLessThan(5);
    expect(res.status).toEqual(200);
    done();
  });

  it('should find "RITALIN" and associated genericNames using incorrect spelling => "ritlin"', async (done) => {
    const res = await request(app)
      .get('/api/search/')
      .query({ q: 'ritlin' });

    const { body } = res;
    const brandName = body.filter(name => name.b === 'RITALIN');
    const genericName = body.filter(name => name.g === 'METHYLPHENIDATE HYDROCHLORIDE');

    expect(brandName.length).toBeGreaterThan(1);
    expect(brandName.length).toBeLessThan(5);
    expect(genericName.length).toBeGreaterThan(1);
    expect(genericName.length).toBeLessThan(9);

    expect(res.status).toEqual(200);
    expect(res.body.length).toBeGreaterThan(7);
    done();
  });

  it('should find "ZOLOFT" and associated genericNames using incorrect spelling => "SZOLOFT"', async (done) => {
    const res = await request(app)
      .get('/api/search/')
      .query({ q: '  SZOLOFT' });

    const { body } = res;
    const brandName = body.filter(name => name.b === 'ZOLOFT');
    const genericName = body.filter(name => name.g === 'SERTRALINE HYDROCHLORIDE');

    expect(brandName.length).toBeGreaterThan(1);
    expect(brandName.length).toBeLessThan(5);
    expect(genericName.length).toBeGreaterThan(1);
    expect(genericName.length).toBeLessThan(5);
    expect(res.status).toEqual(200);
    done();
  });

  it('should find "ATORVASTATIN CALCIUM" and associated genericNames using incorrect spelling => "ATORVASTATIN CACCIUM"', async (done) => {
    const res = await request(app)
      .get('/api/search/')
      .query({ q: 'ATORVASTATIN CACCIUM' });

    const { body } = res;
    const brandName = body.filter(name => name.b === 'LIPITOR');
    const genericName = body.filter(name => name.g === 'ATORVASTATIN CALCIUM');

    expect(brandName.length).toBeGreaterThan(1);
    expect(brandName.length).toBeLessThan(5);
    expect(genericName.length).toBeGreaterThan(1);
    expect(genericName.length).toBeLessThan(10);
    expect(res.status).toEqual(200);
    done();
  });
});

describe('medication search using correct spelling of brand names', () => {

  it('should find "LIPITOR"', async (done) => {
    const res = await request(app)
      .get('/api/search/')
      .query({ q: 'lipitor' });

    const { body } = res;
    const brandName = body.filter(name => name.b === 'LIPITOR');
    const genericName = body.filter(name => name.g === 'ATORVASTATIN CALCIUM');

    expect(brandName.length).toBeGreaterThan(1);
    expect(brandName.length).toBeLessThan(5);
    expect(genericName.length).toBeGreaterThan(1);
    expect(genericName.length).toBeLessThan(10);
    // genericName conbinations, ATORVASTATIN CALCIUM; EZETIMIBE
    expect(body.length).toBeGreaterThan(30);
    expect(res.status).toEqual(200);
    done();
  });

  it('should find "ZANTAC"', async (done) => {
    const res = await request(app)
      .get('/api/search/')
      .query({ q: 'zantac' });

    const { body } = res;
    const brandName = body.filter(name => name.b === 'ZANTAC');
    const genericName = body.filter(name => name.g === 'RANITIDINE HYDROCHLORIDE');

    expect(brandName.length).toBeGreaterThan(1);
    expect(brandName.length).toBeLessThan(3);
    expect(genericName.length).toBeGreaterThan(1);
    expect(genericName.length).toBeLessThan(15);
    expect(res.status).toEqual(200);
    done();
  });
});

describe('medication search using correct spelling of generic names', () => {

  it('should find genericName name "METHYLPHENIDATE HYDROCHLORIDE"', async (done) => {
    const res = await request(app)
      .get('/api/search/')
      .query({ q: 'METHYLPHENIDATE HYDROCHLORIDE' });

    const { body } = res;
    const brandName = body.filter(name => name.b === 'RITALIN');
    const genericName = body.filter(name => name.g === 'METHYLPHENIDATE HYDROCHLORIDE');

    expect(brandName.length).toBeGreaterThan(1);
    expect(brandName.length).toBeLessThan(4);
    expect(genericName.length).toBeGreaterThan(50);
    expect(genericName.length).toBeLessThan(70);
    expect(res.status).toEqual(200);
    done();
  });

  it('should find genericName name "ATORVASTATIN CALCIUM"', async (done) => {
    const res = await request(app)
      .get('/api/search/')
      .query({ q: 'ATORVASTATIN CALCIUM' });

    const { body } = res;
    const brandName = body.filter(name => name.b === 'LIPITOR');
    const genericName = body.filter(name => name.g === 'ATORVASTATIN CALCIUM');

    expect(brandName.length).toBeGreaterThan(1);
    expect(brandName.length).toBeLessThan(7);
    expect(genericName.length).toBeGreaterThan(5);
    expect(genericName.length).toBeLessThan(30);
    expect(res.body.length).toBeGreaterThan(30);
    expect(res.status).toEqual(200);
    done();
  });
});

describe('medication search using partial names', () => {

  it('should find brandNameed name "LIPITOR" and genericNames using word => "lipi"', async (done) => {
    const res = await request(app)
      .get('/api/search/')
      .query({ q: 'lipi' });

    const { body } = res;
    const brandName = body.filter(name => name.b === 'LIPITOR');
    const genericName = body.filter(name => name.g === 'ATORVASTATIN CALCIUM');

    expect(brandName.length).toBeGreaterThan(1);
    expect(brandName.length).toBeLessThan(7);
    expect(genericName.length).toBeGreaterThan(3);
    expect(genericName.length).toBeLessThan(30);
    expect(res.status).toEqual(200);
    done();
  });

  it('should find brand name  "RITODRINE HYDROCHLORIDE" and associated generic name using word => "rit"', async (done) => {
    const res = await request(app)
      .get('/api/search/')
      .query({ q: 'rit' });

    const { body } = res;
    const brandName = body.filter(name => name.b === 'RITODRINE HYDROCHLORIDE');
    const genericName = body.filter(name => name.g === 'RITODRINE HYDROCHLORIDE');

    expect(brandName.length).toBeGreaterThan(1);
    expect(brandName.length).toBeLessThan(7);
    expect(genericName.length).toBeGreaterThan(3);
    expect(genericName.length).toBeLessThan(100);
    expect(res.status).toEqual(200);
    done();
  });

  it('should find brand name "RITALIN" and associatated generic name using word => "riti"', async (done) => {
    const res = await request(app)
      .get('/api/search/')
      .query({ q: 'riti' });

    const { body } = res;
    const brandName = body.filter(name => name.b === 'RITALIN');
    const genericName = body.filter(name => name.g === 'METHYLPHENIDATE HYDROCHLORIDE');

    expect(brandName.length).toBeGreaterThan(1);
    expect(brandName.length).toBeLessThan(7);
    expect(genericName.length).toBeGreaterThan(3);
    expect(genericName.length).toBeLessThan(100);
    expect(res.status).toEqual(200);
    done();
  });
});

describe('Negative tests', () => {

  it('use empty search string', async (done) => {
    const res = await request(app)
      .get('/api/search/')
      .query({ q: '' });
    expect(res.status).toEqual(400);
    done();
  });

  it('search for a medication using invalid drug name  => "dffdfdfdfd"', async (done) => {
    const res = await request(app)
      .get('/api/search/')
      .query({ q: 'dffdfdfdfd' });
    expect(res.status).toEqual(200);
    expect(res.body.length).toEqual(0);
    done();
  });

  it('should reject, max chars exceeded for medication name => "bart simpson never does his homework bart simpson never does his homework"',
    async (done) => {
      const res = await request(app)
        .get('/api/search/')
        .query({ q: 'bart simpson never does his homework bart simpson never does his homework' });
      expect(res.status).toEqual(400);
      done();
    });
});
