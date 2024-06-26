'use server';
import { GetAuth } from '../auth';
import { google } from 'googleapis';

const getWebmaster = async () => {
  const auth = await GetAuth.getAuth(
    {
      PROJECT_ID: process.env['GCP_PROJECT_ID'] as string,
      PRIVATE_KEY_ID: process.env['GCP_PRIVATE_KEY_ID'] as string,
      PRIVATE_KEY: process.env['GCP_PRIVATE_KEY'] as string,
      CLIENT_EMAIL: process.env['GCP_CLIENT_EMAIL'] as string,
    },
    ['https://www.googleapis.com/auth/webmasters.readonly'],
  );
  return google.webmasters({
    version: 'v3',
    auth: auth,
  });
};

const getSearchAnalytics = async () => {
  const webmasters = await getWebmaster();
  const query = await webmasters.searchanalytics.query({
    siteUrl: 'sc-domain:meertarbani.in',
    requestBody: {
      startDate: process.env['ANALYTICS_VIEW_START_DATE'] as string, // this returns date from exact 1 month back from today
      endDate: new Date().toISOString().split('T')[0],
      dimensions: ['query'],
    },
  });
  return query.data;
};

export const getTotalVisits = async () => {
  const searchAnalytics = await getSearchAnalytics();
  let totalClicks = 0;
  let totalImpressions = 0;
  searchAnalytics.rows?.forEach((row) => {
    totalClicks += row.clicks ?? 0;
    totalImpressions += row.impressions ?? 0;
  });
  return searchAnalytics.rows?.reduce((acc, curr) => {
    return acc + (curr.clicks ?? 0) + (curr.impressions ?? 0);
  }, 0);
};
