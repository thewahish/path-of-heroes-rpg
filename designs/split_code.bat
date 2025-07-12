@echo off
setlocal

rem Define the name of the file where you'll paste the consolidated code
set "UPDATE_FILE=update.txt"
set "POWERSHELL_SCRIPT_NAME=split_update_temp.ps1"

rem Check if the consolidated update file exists
if not exist "%UPDATE_FILE%" (
    echo Error: Consolidated update file "%UPDATE_FILE%" not found.
    echo Please create "%UPDATE_FILE%" in the same directory as this batch script
    echo and paste the consolidated code into it.
    goto :eof
)

echo.
echo --- Path of Heroes Code Splitter ---
echo.
echo Reading code from "%UPDATE_FILE%"...
echo.

rem Create the PowerShell script dynamically
echo $content = Get-Content -Raw -Path """%UPDATE_FILE%""" > "%POWERSHELL_SCRIPT_NAME%"
echo $files = @{} >> "%POWERSHELL_SCRIPT_NAME%"
echo $currentPath = "" >> "%POWERSHELL_SCRIPT_NAME%"
echo $currentContent = "" >> "%POWERSHELL_SCRIPT_NAME%"
echo $lines = $content -split "`r`n" >> "%POWERSHELL_SCRIPT_NAME%"
echo. >> "%POWERSHELL_SCRIPT_NAME%"
echo foreach ($line in $lines) { >> "%POWERSHELL_SCRIPT_NAME%"
echo     if ($line -match "^--- FILE: (.+) ---$") { >> "%POWERSHELL_SCRIPT_NAME%"
echo         if ($currentPath) { $files[$currentPath] = $currentContent } >> "%POWERSHELL_SCRIPT_NAME%"
echo         $currentPath = $matches[1].Trim() >> "%POWERSHELL_SCRIPT_NAME%"
echo         $currentContent = "" >> "%POWERSHELL_SCRIPT_NAME%"
echo     } else { >> "%POWERSHELL_SCRIPT_NAME%"
echo         $currentContent += $line + "`n" >> "%POWERSHELL_SCRIPT_NAME%"
echo     } >> "%POWERSHELL_SCRIPT%
echo } >> "%POWERSHELL_SCRIPT_NAME%"
echo if ($currentPath) { $files[$currentPath] = $currentContent } >> "%POWERSHELL_SCRIPT_NAME%"
echo. >> "%POWERSHELL_SCRIPT_NAME%"
echo foreach ($path in $files.Keys) { >> "%POWERSHELL_SCRIPT_NAME%"
echo     $dir = Split-Path -Parent $path >> "%POWERSHELL_SCRIPT_NAME%"
echo     if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null } >> "%POWERSHELL_SCRIPT_NAME%"
echo     $files[$path] | Set-Content -Path $path -Encoding UTF8 -Force >> "%POWERSHELL_SCRIPT_NAME%"
echo     Write-Host "Updated: $path" >> "%POWERSHELL_SCRIPT_NAME%"
echo } >> "%POWERSHELL_SCRIPT_NAME%"
echo Write-Host "`nAll files processed successfully." >> "%POWERSHELL_SCRIPT_NAME%"

rem Execute the generated PowerShell script
powershell -NoProfile -ExecutionPolicy Bypass -File "%POWERSHELL_SCRIPT_NAME%"

rem Clean up the temporary PowerShell script
del "%POWERSHELL_SCRIPT_NAME%"

echo.
echo Press any key to exit.
pause >nul
endlocal