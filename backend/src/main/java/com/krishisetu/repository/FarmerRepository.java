package com.krishisetu.repository;

import com.krishisetu.entity.Farmer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FarmerRepository extends JpaRepository<Farmer, Long> {
    Optional<Farmer> findByUserId(Long userId);
    Optional<Farmer> findByAadhaarHash(String aadhaarHash);
    List<Farmer> findByDistrictAndState(String district, String state);
}
