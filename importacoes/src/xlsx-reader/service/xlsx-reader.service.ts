import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import { EventDto } from '../domain/event.dto';
import * as ExcelJS from 'exceljs';
import { featureToCamelCase, objToString } from '../seedwork/utilities';
import { randomUUID } from 'crypto';

export const charToByte = (c: string) => {
  return c.charCodeAt(0) < 128
    ? c.charCodeAt(0) // This is english alphabet
    : c.charCodeAt(0) - 0x0e01 /* Utf8 ก */ + 161; /* Window-874 ก*/
};
export const toByteArray = (s: string) => {
  return s.split('').map((c) => charToByte(c));
};
export const utf8ToAnsi = (s: string) => {
  return toByteArray(s)
    .map((c) => String.fromCharCode(c))
    .reduce((converted, c) => converted + c, '');
};

function removeAcento(text: string): string {
  text = text.toLowerCase();
  text = text.replace(/[áàâã]/gi, 'a');
  text = text.replace(/[éèê]/gi, 'e');
  text = text.replace(/[íìî]/gi, 'i');
  text = text.replace(/[óòôõ]/gi, 'o');
  text = text.replace(/[úùû]/gi, 'u');
  text = text.replace(/ç/gi, 'c');

  return text;
}

@Injectable()
export class XlsxReaderService {
  public async *readFile(file: Readable): AsyncGenerator<EventDto> {
    const workbookReader = new ExcelJS.stream.xlsx.WorkbookReader(file, {
      worksheets: 'emit',
    });
    for await (const worksheetReader of workbookReader) {
      for await (const event of this.readSheet(worksheetReader)) {
        yield event;
      }
    }
  }

  private rowToArray(row: ExcelJS.Row) {
    const values = Array.isArray(row.values) ? row.values : [];

    return values;
  }

  private async *readSheet(
    worksheetReader: ExcelJS.stream.xlsx.WorksheetReader,
  ): AsyncGenerator<EventDto> {
    let fields: string[] = [];
    const batch_id = randomUUID().toString();

    for await (const row of worksheetReader) {
      if (row.hasValues) {
        const values = this.rowToArray(row);

        if (row.number === 1) {
          fields = values
            .filter((el) => el !== null && el !== undefined)
            .map((el) => featureToCamelCase(objToString(el)));

          continue;
        }

        if (!values[0]) {
          values.shift();
        }

        const objectParsed = Object.fromEntries(
          fields.map((key, index) => [key, values[index]]),
        );

        yield {
          batch_id,
          name: removeAcento(row.worksheet.name)
            .replaceAll(' ', '_')
            .split('')
            .join(''),
          data: objectParsed,
        };
      }
    }
  }
}
