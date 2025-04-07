lib.addKeybind({
    name = 'lockfront',
    description = 'Lock front radar',
    defaultKey = 'NUMPAD4',
    onPressed = function(self)
        if not IsVisible then
            return
        end

        Locked.front = not Locked.front

        HandleNuiMessage({
            action = 'blockRadar',
            data = {
                side = 'front',
                blocked = Locked.front
            }
        })
    end
})
lib.addKeybind({
    name = 'lockback',
    description = 'Lock back radar',
    defaultKey = 'NUMPAD6',
    onPressed = function(self)
        if not IsVisible then
            return
        end

        Locked.back = not Locked.back

        HandleNuiMessage({
            action = 'blockRadar',
            data = {
                side = 'back',
                blocked = Locked.back
            }
        })
    end
})

lib.addKeybind({
    name = 'radarmove',
    description = 'Move/Toggle Radar',
    defaultKey = 'NUMPAD5',
    onPressed = function(self)
        local is_allowed = lib.table.contains(Config.AllowedJobs, ESX.PlayerData.job.name)

        if not is_allowed then
            return
        end

        CanMove = not CanMove

        HandleNuiMessage({
            action = 'canMove',
            data = CanMove
        }, CanMove)

        HandleNuiMessage({
            action = 'setVisibileRadar',
            data = true,
        })
    end
})


RegisterNuiCallback('canMove', function(_, cb)
    CanMove = false
    SetNuiFocus(false, false)

    if not IsVisible then
        HandleNuiMessage({
            action = 'setVisibileRadar',
            data = false,
        })
    end

    cb('ok')
end)
