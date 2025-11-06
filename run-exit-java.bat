mvn spring-boot:run | Tee-Object -Variable output | ForEach-Object {
    $_
    if ($_ -match "Started .*Application") {
        Write-Host "✅ Aplicação iniciada com sucesso. Encerrando processo..."
        Stop-Process -Id $PID
    }
}
