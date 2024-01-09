
function calculateEuclideanDistance(location1, location2) {
    const deltaX = location2.lat - location1.lat;
    const deltaY = location2.lng - location1.lng;

    // Euclidean distance formula
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    return distance;
}


SELECT 
    ST_Distance(u1.location::geography, u2.location::geography) AS spherical_distance,
    u1.age AS age_user1,
    u1.sex AS sex_user1,
    u1.college AS college_user1,
    u2.age AS age_user2,
    u2.sex AS sex_user2,
    u2.college AS college_user2
FROM 
    users u1,
    users u2
WHERE 
    u1.id = [User_ID_1] AND u2.id = [User_ID_2];
