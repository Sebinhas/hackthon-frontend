import { AlertCircle, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { ValidationSummary as ValidationSummaryType } from '../types/uploadFile.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ValidationSummaryProps {
  summary: ValidationSummaryType;
  onClose: () => void;
}

export const ValidationSummary = ({ summary, onClose }: ValidationSummaryProps) => {
  const { isValid, totalErrors, totalWarnings, errors, warnings } = summary;

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          {isValid ? (
            <>
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              <CardTitle className="text-green-700">Validación exitosa</CardTitle>
            </>
          ) : (
            <>
              <XCircle className="h-6 w-6 text-red-600" />
              <CardTitle className="text-red-700">Errores encontrados</CardTitle>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Resumen de estadísticas */}
        <div className="grid grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg ${isValid ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="text-sm font-medium text-gray-600">Errores</div>
            <div className={`text-2xl font-bold ${isValid ? 'text-green-700' : 'text-red-700'}`}>
              {totalErrors}
            </div>
          </div>
          <div className={`p-4 rounded-lg ${warnings.length > 0 ? 'bg-yellow-50' : 'bg-gray-50'}`}>
            <div className="text-sm font-medium text-gray-600">Advertencias</div>
            <div className={`text-2xl font-bold ${warnings.length > 0 ? 'text-yellow-700' : 'text-gray-700'}`}>
              {totalWarnings}
            </div>
          </div>
          <div className={`p-4 rounded-lg ${isValid ? 'bg-green-50' : 'bg-gray-50'}`}>
            <div className="text-sm font-medium text-gray-600">Estado</div>
            <div className={`text-lg font-semibold ${isValid ? 'text-green-700' : 'text-gray-700'}`}>
              {isValid ? '✅ Listo' : '❌ Revisar'}
            </div>
          </div>
        </div>

        {/* Mensaje principal */}
        {isValid ? (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-semibold text-green-900">0 errores encontrados</p>
                <p className="text-sm text-green-700 mt-1">
                  Su archivo está listo para ser subido. Puede proceder con la carga de datos.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900">Corrija los errores antes de continuar</p>
                <p className="text-sm text-red-700 mt-1">
                  Por favor, revise los errores a continuación y corrija el archivo CSV manualmente.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Lista de errores */}
        {errors.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-red-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Errores ({totalErrors})
            </h3>
            <div className="space-y-2">
              {errors.map((error, index) => (
                <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-red-900">{error.message}</p>
                      {error.detail && (
                        <p className="text-sm text-red-700 mt-1">{error.detail}</p>
                      )}
                      <div className="mt-2">
                        <p className="text-xs font-medium text-red-800">
                          Filas afectadas ({error.affectedRows.length}):
                        </p>
                        <p className="text-xs text-red-600 mt-1">
                          {error.affectedRows.slice(0, 20).join(', ')}
                          {error.affectedRows.length > 20 && ` y ${error.affectedRows.length - 20} más...`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lista de advertencias */}
        {warnings.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-yellow-700 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Advertencias ({totalWarnings})
            </h3>
            <div className="space-y-2">
              {warnings.map((warning, index) => (
                <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-yellow-900">{warning.message}</p>
                      {warning.detail && (
                        <p className="text-sm text-yellow-700 mt-1">{warning.detail}</p>
                      )}
                      <div className="mt-2">
                        <p className="text-xs font-medium text-yellow-800">
                          Filas afectadas ({warning.affectedRows.length}):
                        </p>
                        <p className="text-xs text-yellow-600 mt-1">
                          {warning.affectedRows.slice(0, 20).join(', ')}
                          {warning.affectedRows.length > 20 && ` y ${warning.affectedRows.length - 20} más...`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

