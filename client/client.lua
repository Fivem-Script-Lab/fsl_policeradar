local PlayerPedId = PlayerPedId
local IsPedInAnyVehicle = IsPedInAnyVehicle
local StartShapeTestCapsule = StartShapeTestCapsule
local GetOffsetFromEntityInWorldCoords = GetOffsetFromEntityInWorldCoords
local GetVehicleNumberPlateText = GetVehicleNumberPlateText
local GetShapeTestResult = GetShapeTestResult
local GetEntitySpeed = GetEntitySpeed
local IsEntityAVehicle = IsEntityAVehicle
local GetEntityModel = GetEntityModel

RadarVisibility = true

InCar = false

Locked = {
    front = false,
    back = false,
}

CanMove = false

IsVisible = false

---Start a RayCast
---@param ray_start vector3
---@param ray_end vector3
---@return integer | false
local function rayCast(ray_start, ray_end, vehicle)
    local raycast_test = StartShapeTestCapsule(
        ray_start.x, ray_start.y, ray_start.z,
        ray_end.x, ray_end.y, ray_end.z,
        3.0, 2, vehicle, 7
    )

    local _, hit, end_coords, _, entity_hit = GetShapeTestResult(raycast_test)

    if hit and IsEntityAVehicle(entity_hit) then
        Debug(ray_start, 0.2, vec3(255, 0, 0))
        Debug(end_coords, 0.5, vec3(0, 255, 0))
        return entity_hit
    end

    return false
end


local function getVehicleData(vehicle)
    if not vehicle or not IsEntityAVehicle(vehicle) then return end

    local plate = GetVehicleNumberPlateText(vehicle)
    local speed = GetEntitySpeed(vehicle) * 2.236936

    return { plate = plate, speed = math.floor(speed) }
end

lib.onCache('vehicle', function(vehicle)
    if not vehicle then
        return
    end

    local is_allowed = lib.table.contains(Config.AllowedJobs, ESX.PlayerData.job.name)

    if not is_allowed then
        return
    end

    if Config.AllowedVehicles and not lib.table.contains(Config.AllowedVehicles, GetEntityModel(vehicle)) then
        return
    end

    CreateThread(function()
        local player_ped = PlayerPedId()
        local vehicles = { front = nil, back = nil }

        InCar = true

        while true do
            if not IsPedInAnyVehicle(player_ped, false) then
                InCar = false

                if IsVisible then
                    IsVisible = false

                    HandleNuiMessage({
                        action = 'setVisibleRadar',
                        data = false,
                    })
                end

                break
            end

            if not RadarVisibility and IsVisible then
                IsVisible = false

                if not CanMove then
                    HandleNuiMessage({
                        action = 'setVisibleRadar',
                        data = false,
                    })
                end
            elseif RadarVisibility and not IsVisible then
                IsVisible = true

                HandleNuiMessage({
                    action = 'setVisibleRadar',
                    data = true,
                })
            end

            if not Locked.front and RadarVisibility then
                local front_ray_start = GetOffsetFromEntityInWorldCoords(vehicle, 0.0, Config.MinDistance, 0.0)
                local front_ray_end = GetOffsetFromEntityInWorldCoords(vehicle, 0.0, Config.MaxDistance, -0.5)
                vehicles.front = rayCast(front_ray_start, front_ray_end, vehicle)
                HandleNuiMessage({
                    action = 'vehicleDataFront',
                    data = getVehicleData(vehicles.front)
                })
            end

            if not Locked.back and RadarVisibility then
                local back_ray_start = GetOffsetFromEntityInWorldCoords(vehicle, 0.0, -Config.MinDistance, 0.0)
                local back_ray_end = GetOffsetFromEntityInWorldCoords(vehicle, 0.0, -Config.MaxDistance, -0.5)
                vehicles.back = rayCast(back_ray_start, back_ray_end, vehicle)
                HandleNuiMessage({
                    action = 'vehicleDataBack',
                    data = getVehicleData(vehicles.back)
                })
            end

            Wait(Config.UpdateTime)
        end
    end)
end)


RegisterNUICallback('displayRadar', function(data, cb)
    RadarVisibility = data
    cb('ok')
end)
