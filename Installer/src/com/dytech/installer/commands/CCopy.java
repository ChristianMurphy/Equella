/*
 * Licensed to The Apereo Foundation under one or more contributor license
 * agreements. See the NOTICE file distributed with this work for additional
 * information regarding copyright ownership.
 *
 * The Apereo Foundation licenses this file to you under the Apache License,
 * Version 2.0, (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at:
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.dytech.installer.commands;

import com.dytech.common.io.FileWrapper;
import com.dytech.installer.InstallerException;
import java.io.IOException;

public class CCopy extends Command {
  protected String source;
  protected String destination;
  protected boolean overwrite;

  public CCopy(String source, String destination, boolean overwrite) {
    this.source = source;
    this.destination = destination;
    this.overwrite = overwrite;
  }

  @Override
  public void execute() throws InstallerException {
    propogateTaskStarted(1);

    FileWrapper s = new FileWrapper(source);
    FileWrapper d = new FileWrapper(destination);

    try {
      s.copy(d, overwrite);
    } catch (IOException ex) {
      final String message =
          ""
              + "Fatal Error Copying File:\n"
              + "Source = "
              + s.getAbsolutePath()
              + '\n'
              + "Destination = "
              + d.getAbsolutePath()
              + '\n'
              + "Overwrite = "
              + Boolean.toString(overwrite);
      throw new InstallerException(message, ex);
    }

    propogateSubtaskCompleted();
    propogateTaskCompleted();
  }

  @Override
  public String toString() {
    return new String("Copying " + source + " to " + destination);
  }
}
