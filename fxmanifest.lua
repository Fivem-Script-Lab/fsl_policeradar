fx_version 'cerulean'
game 'gta5'


description 'FSL Radar'
author 'kr3mu & kamii'
version '1.0'

lua54 'yes'

-- ui_page 'http://localhost:5173/'
ui_page 'web/build/index.html'

client_script 'client/**/*'

server_script 'server/**/*'

shared_scripts {
    '@ox_lib/init.lua',
    '@es_extended/imports.lua',
    'shared/**/*'
}

files {
    'web/build/index.html',
    'web/build/**/*',
}
