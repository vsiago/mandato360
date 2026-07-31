-- Alinha a obrigatoriedade das colunas com o que o codigo declara.
--
-- Motivo: o banco exigia NOT NULL em colunas que schema.ts trata como
-- opcionais e que as server actions nao enviam. Resultado pratico:
--   - createLead/createEleitor quebrava 100% das vezes (eleitor.bairro)
--   - demanda sem eleitor vinculado quebrava (demanda."eleitorId")
--
-- DROP NOT NULL nao apaga nem altera dado existente.

ALTER TABLE "eleitor" ALTER COLUMN "bairro"     DROP NOT NULL;
ALTER TABLE "demanda" ALTER COLUMN "eleitorId"  DROP NOT NULL;
