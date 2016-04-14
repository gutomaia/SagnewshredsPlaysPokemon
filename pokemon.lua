pcall(require, "luarocks.require")
local socket = require "socket"

local INPUT_PORT = 53474

local incomming = socket.udp()
incomming:setsockname("*", 53474)
incomming:settimeout(0)

function press_button(button)
    input_table = {}
    input_table[button] = true
    joypad.set(1, input_table)
end

function has_value (tab, val)
    for index, value in ipairs (tab) do
        if value == val then
            return true
        end
    end
    return false
end

gb_buttons = {'A', 'B', 'up', 'down', 'left', 'right', 'start', 'select'}

while true do
    button, ip, port = incomming:receivefrom()
    if button ~= nil then
        if has_value(gb_buttons, button) then
            press_button(button)
            emu.message('Pressing: ' .. button)
        end
    end
    socket.sleep(0.01)
    emu.frameadvance()
end
