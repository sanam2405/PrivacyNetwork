CREATE OR REPLACE FUNCTION nearby_entities_within_d(lat FLOAT, long FLOAT, d FLOAT, entity_type TEXT)
RETURNS TABLE (
    id TEXT,
    name TEXT,
    email TEXT,
    age FLOAT,
    gender TEXT,
    college TEXT,
    isVisible BOOLEAN,
    lat FLOAT,
    long FLOAT,
    dist_meters FLOAT
)
LANGUAGE SQL
AS $$
    SELECT
        entity.id,
        entity.name,
        entity.email,
        entity.age,
        entity.gender,
        entity.college,
        entity."isVisible",
        latitude AS lat,
        longitude AS long,
        ST_DISTANCE(
            ST_GeomFromText('POINT(' || long || ' ' || lat || ')', 4326)::geography,
            ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
        ) AS dist_meters
    FROM
        "Location"
    JOIN
        "User" entity ON "Location".id = entity."locationId"
    WHERE
        ST_DISTANCE(
            ST_GeomFromText('POINT(' || long || ' ' || lat || ')', 4326)::geography,
            ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
        ) <= d AND entity_type = 'user' 
    ORDER BY
        ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography <-> ST_GeomFromText('POINT(' || long || ' ' || lat || ')', 4326)::geography;
$$;
