package com.krishisetu.repository;

import com.krishisetu.entity.ProcurementCenter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProcurementCenterRepository extends JpaRepository<ProcurementCenter, Long> {
    Optional<ProcurementCenter> findByCenterCode(String centerCode);
    List<ProcurementCenter> findByDistrictAndIsActiveTrue(String district);
    List<ProcurementCenter> findByIsActiveTrue();

    // Haversine formula calculation in SQL to find nearby centers within radiusKm
    @Query(value = """
        SELECT c.*, ( 6371 * acos( cos( radians(:lat) ) * cos( radians( c.latitude ) ) 
        * cos( radians( c.longitude ) - radians(:lon) ) + sin( radians(:lat) ) 
        * sin( radians( c.latitude ) ) ) ) AS distance_km 
        FROM procurement_centers c 
        WHERE c.is_active = true 
        ORDER BY distance_km ASC
        """, nativeQuery = true)
    List<ProcurementCenter> findNearbyCentersOrderByDistance(@Param("lat") Double lat, @Param("lon") Double lon);
}
