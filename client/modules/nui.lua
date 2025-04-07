---@class NuiMessage
---@field action string
---@field data? any

---@param message NuiMessage
---@param shouldFocus? boolean
function HandleNuiMessage(message, shouldFocus)
    if not (type(message) == 'table') then return end
    if shouldFocus ~= nil then
        SetNuiFocus(shouldFocus, shouldFocus)
    end
    SendNUIMessage(message)
end

function HideComponent(data, cb)
    HandleNuiMessage(data, false)
    cb(true)
end

RegisterNUICallback('hideComponent', HideComponent)
