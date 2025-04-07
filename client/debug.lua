local DrawBox = DrawBox

local boxes = {}

---Debug Function
---@param pos vector3
---@param size number
---@param color vector3
function Debug(pos, size, color)
    if Config.Debug then
        table.insert(boxes, { pos = pos, size = size, color = color })
    end
end

if Config.Debug then
    CreateThread(function()
        while true do
            for _, box in pairs(boxes) do
                local pos = box.pos
                local size = box.size
                local color = box.color

                DrawBox(
                    pos.x - size,
                    pos.y - size,
                    pos.z - size,
                    pos.x + size,
                    pos.y + size,
                    pos.z + size,
                    color.x,
                    color.y,
                    color.z,
                    100
                )
            end
            Wait(0)
        end
    end)

    CreateThread(function()
        while true do
            boxes = {}
            Wait(5000)
        end
    end)
end
