# 1. Datei von GCS herunterladen
gcloud storage cp gs://DEIN-BUCKET-NAME/db_backup_20261003_030000.sql.gz.gpg .

# 2. Entschlüsseln, entpacken und direkt in PostgreSQL pipen
gpg --decrypt --batch --passphrase "DEIN_BACKUP_PASSWORT" db_backup_20261003_030000.sql.gz.gpg \
    | gunzip \
    | docker exec -i springboard_db psql -U $POSTGRES_USER -d $POSTGRES_DB