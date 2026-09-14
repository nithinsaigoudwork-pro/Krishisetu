package com.krishisetu.service;

import com.krishisetu.entity.Crop;
import com.krishisetu.entity.Farmer;
import com.krishisetu.entity.FarmerCrop;
import com.krishisetu.exception.ResourceNotFoundException;
import com.krishisetu.repository.CropRepository;
import com.krishisetu.repository.FarmerCropRepository;
import com.krishisetu.repository.FarmerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FarmerService {

    private final FarmerRepository farmerRepository;
    private final FarmerCropRepository farmerCropRepository;
    private final CropRepository cropRepository;

    public Farmer getFarmerById(@NonNull Long id) {
        return farmerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Farmer not found with id: " + id));
    }

    public Farmer getFarmerByUserId(@NonNull Long userId) {
        return farmerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Farmer profile not found for user: " + userId));
    }

    @Transactional
    public FarmerCrop registerFarmerProduce(@NonNull Long farmerId, @NonNull Long cropId, BigDecimal acres, BigDecimal estimatedYield, String seasonYear) {
        Farmer farmer = getFarmerById(farmerId);
        Crop crop = cropRepository.findById(cropId)
                .orElseThrow(() -> new ResourceNotFoundException("Crop not found with id: " + cropId));

        FarmerCrop farmerCrop = farmerCropRepository
                .findByFarmerIdAndCropIdAndSeasonYear(farmerId, cropId, seasonYear)
                .orElse(FarmerCrop.builder()
                        .farmer(farmer)
                        .crop(crop)
                        .seasonYear(seasonYear)
                        .build());

        farmerCrop.setCultivatedAcres(acres);
        farmerCrop.setEstimatedYieldQuintals(estimatedYield);
        farmerCrop.setVerifiedByPatwari(true);

        return farmerCropRepository.save(farmerCrop);
    }

    public List<FarmerCrop> getFarmerProduce(@NonNull Long farmerId) {
        return farmerCropRepository.findByFarmerId(farmerId);
    }
}
