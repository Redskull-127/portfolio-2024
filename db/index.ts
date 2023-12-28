import * as schema from "./schema";
import { PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

declare global {
  // eslint-disable-next-line no-var -- only var works here
  var db: PostgresJsDatabase<typeof schema> | undefined;
}

let db: PostgresJsDatabase<typeof schema>;

try {
  if (process.env.NODE_ENV === "production") {
    db = drizzle(
      postgres(`${process.env.DATABASE_URL}?sslmode=require`, {
        ssl: {
          rejectUnauthorized: false,
          ca: `-----BEGIN CERTIFICATE-----
          MIIEQTCCAqmgAwIBAgIULYNKyzsjqLvUwQDTj1wqON7BPPgwDQYJKoZIhvcNAQEM
          BQAwOjE4MDYGA1UEAwwvMjg0MGQxM2YtN2UyYy00MjU1LWIwMmUtN2RlYjUwYTQ0
          YWNlIFByb2plY3QgQ0EwHhcNMjMxMjE5MDkxMjQ2WhcNMzMxMjE2MDkxMjQ2WjA6
          MTgwNgYDVQQDDC8yODQwZDEzZi03ZTJjLTQyNTUtYjAyZS03ZGViNTBhNDRhY2Ug
          UHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCCAYoCggGBAJh8fd5l
          X4NAjY4RsVceFW7lWGE22aN04j76y0rV6uv/LRR0HHEbZTVWoJMNP85jWbkDF35J
          K7VGoqOM+QtJueZa6nygd2ebFD1QdiBVXvB3s31MMI28e0ojsasXQzKvD2lNB6Ke
          MjyPuq17CbSEsiAWJ/BwWGGFU0lA7f6fblaxF8J9vB/tj7qTMxyXMvGJiBYd26kT
          jP58cYEI0AKfx5JG+mXH4GGezuBqQ3AzvRxdYdGGOH69g7XuGxk4WAF9K4SOpEU7
          udraIdJKri8He+Ln/dKKdYh0Wgm0+8FCkS36uaFRc9IriQpQXHimdbhhzwqN1YpM
          TvoPIvzW4y/YT3vxrG87E0GAM2c3wdJ1mcmLrv+rx5O1zIBEWHR/QfMa+iZb75VK
          zUWm2q4xEdtuQXbgv1ZKers3av/JqsN9CpODSJL92g1tgCa7zMhxGr3UD32X6gS+
          SHbs5Jft2QnUgCPKNc4VUD4KWshujpswafo9hljaIjfJ864Pv8bZ0XIEiwIDAQAB
          oz8wPTAdBgNVHQ4EFgQUJqKq/chs1lFirt0h8IieqJzwjYcwDwYDVR0TBAgwBgEB
          /wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGBACDN2yQXHmdvU072
          wIFpbNRsEzv4/U6k9J5I/hXZXpehAKKlSCZWlVz6Ih60NB+DbQe0u8Iv8Jn47QUt
          DmP8CsOF40po6TJ1P+SXuvXetPJaDSK5+1zEDd/ruab5NHK6trRWWqhVQ6es3Wit
          /8RHSxHZyw/51OA8/sEwhNi1HiAk4/BAkUcvgtYe0i6wWwnbO4o+fh4aQc63pIb2
          CxRHZbBbaz/kFO9an//7Lqh7yfzE/9y3n4Mv9OwVIapJK2w4xwPFxskz8dGaKvv1
          HBl3ChMThWMFhp/OxkukWNs70Gr2kOytX5HVaysjI1k/IIeYFtqH6dafoxAIH81l
          x4PkLAgLj7ljDs+1mqw1DZ0YHx7vstP0t7eC6Rv82I1lE5WIcrUt7Fze6UaIdM4g
          0AK5xawIuu0Z9y3oHR1hC3ao4CiHvzHfjCzLWqrg1hxy2/RE/xW62lySg4doyF2G
          KzWNfGXJRW5nrD5ob0Cw4i20IUWc756ylhkZRqChYBZnH9KRgg==
          -----END CERTIFICATE-----
          `,
        },
      }),
      {
        schema,
      }
    );
  } else {
    if (!global.db) {
      global.db = drizzle(
        postgres(`${process.env.DATABASE_URL}?sslmode=require`, {
          ssl: {
            rejectUnauthorized: false,
            ca: `-----BEGIN CERTIFICATE-----
            MIIEQTCCAqmgAwIBAgIULYNKyzsjqLvUwQDTj1wqON7BPPgwDQYJKoZIhvcNAQEM
            BQAwOjE4MDYGA1UEAwwvMjg0MGQxM2YtN2UyYy00MjU1LWIwMmUtN2RlYjUwYTQ0
            YWNlIFByb2plY3QgQ0EwHhcNMjMxMjE5MDkxMjQ2WhcNMzMxMjE2MDkxMjQ2WjA6
            MTgwNgYDVQQDDC8yODQwZDEzZi03ZTJjLTQyNTUtYjAyZS03ZGViNTBhNDRhY2Ug
            UHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCCAYoCggGBAJh8fd5l
            X4NAjY4RsVceFW7lWGE22aN04j76y0rV6uv/LRR0HHEbZTVWoJMNP85jWbkDF35J
            K7VGoqOM+QtJueZa6nygd2ebFD1QdiBVXvB3s31MMI28e0ojsasXQzKvD2lNB6Ke
            MjyPuq17CbSEsiAWJ/BwWGGFU0lA7f6fblaxF8J9vB/tj7qTMxyXMvGJiBYd26kT
            jP58cYEI0AKfx5JG+mXH4GGezuBqQ3AzvRxdYdGGOH69g7XuGxk4WAF9K4SOpEU7
            udraIdJKri8He+Ln/dKKdYh0Wgm0+8FCkS36uaFRc9IriQpQXHimdbhhzwqN1YpM
            TvoPIvzW4y/YT3vxrG87E0GAM2c3wdJ1mcmLrv+rx5O1zIBEWHR/QfMa+iZb75VK
            zUWm2q4xEdtuQXbgv1ZKers3av/JqsN9CpODSJL92g1tgCa7zMhxGr3UD32X6gS+
            SHbs5Jft2QnUgCPKNc4VUD4KWshujpswafo9hljaIjfJ864Pv8bZ0XIEiwIDAQAB
            oz8wPTAdBgNVHQ4EFgQUJqKq/chs1lFirt0h8IieqJzwjYcwDwYDVR0TBAgwBgEB
            /wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGBACDN2yQXHmdvU072
            wIFpbNRsEzv4/U6k9J5I/hXZXpehAKKlSCZWlVz6Ih60NB+DbQe0u8Iv8Jn47QUt
            DmP8CsOF40po6TJ1P+SXuvXetPJaDSK5+1zEDd/ruab5NHK6trRWWqhVQ6es3Wit
            /8RHSxHZyw/51OA8/sEwhNi1HiAk4/BAkUcvgtYe0i6wWwnbO4o+fh4aQc63pIb2
            CxRHZbBbaz/kFO9an//7Lqh7yfzE/9y3n4Mv9OwVIapJK2w4xwPFxskz8dGaKvv1
            HBl3ChMThWMFhp/OxkukWNs70Gr2kOytX5HVaysjI1k/IIeYFtqH6dafoxAIH81l
            x4PkLAgLj7ljDs+1mqw1DZ0YHx7vstP0t7eC6Rv82I1lE5WIcrUt7Fze6UaIdM4g
            0AK5xawIuu0Z9y3oHR1hC3ao4CiHvzHfjCzLWqrg1hxy2/RE/xW62lySg4doyF2G
            KzWNfGXJRW5nrD5ob0Cw4i20IUWc756ylhkZRqChYBZnH9KRgg==
            -----END CERTIFICATE-----
            `,
          },
        }),
        { schema }
      );
    }
    db = global.db;
  }
} catch (e) {
  console.log(e);
}

export { db };
